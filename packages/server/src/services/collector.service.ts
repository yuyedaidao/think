import { CollectDto } from '@dtos/collect.dto';
import { CollectorEntity } from '@entities/collector.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentService } from '@services/document.service';
import { OutUser, UserService } from '@services/user.service';
import { WikiService } from '@services/wiki.service';
import { CollectType } from '@think/domains';
import * as lodash from 'lodash';
import { Repository } from 'typeorm';

@Injectable()
export class CollectorService {
  constructor(
    @InjectRepository(CollectorEntity)
    private readonly collectorRepo: Repository<CollectorEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => WikiService))
    private readonly wikiService: WikiService,
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService
  ) {}

  async toggleStar(user: OutUser, dto: CollectDto) {
    const data = {
      ...dto,
      userId: user.id,
    };
    const record = await this.collectorRepo.findOne(data);
    if (record) {
      await this.collectorRepo.remove(record);
      return;
    } else {
      const res = await this.collectorRepo.create(data);
      const ret = await this.collectorRepo.save(res);
      return ret;
    }
  }

  async isStared(user: OutUser, dto: CollectDto) {
    const res = await this.collectorRepo.findOne({ userId: user.id, ...dto });
    return Boolean(res);
  }

  async getWikis(user: OutUser) {
    const records = await this.collectorRepo.find({
      userId: user.id,
      type: CollectType.wiki,
    });
    const res = await this.wikiService.findByIds(records.map((record) => record.targetId));
    const withCreateUserRes = await Promise.all(
      res.map(async (wiki) => {
        const createUser = await this.userService.findById(wiki.createUserId);
        const isMember = await this.wikiService.isMember(wiki.id, user.id);
        return { createUser, isMember, ...wiki };
      })
    );

    return withCreateUserRes;
  }

  async getDocuments(user: OutUser) {
    const records = await this.collectorRepo.find({
      userId: user.id,
      type: CollectType.document,
    });
    const res = await this.documentService.findByIds(records.map((record) => record.targetId));
    const withCreateUserRes = await Promise.all(
      res.map(async (doc) => {
        const createUser = await this.userService.findById(doc.createUserId);
        return { createUser, ...doc };
      })
    );

    return withCreateUserRes.map((document) => {
      return lodash.omit(document, ['state', 'content', 'index', 'createUserId']);
    });
  }
}
