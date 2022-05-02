import React, { useCallback } from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconList } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import { useActive } from 'tiptap/hooks/use-active';
import { Title } from 'tiptap/extensions/title';
import { BulletList as BulletListExtension } from 'tiptap/extensions/bullet-list';

export const BulletList: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isBulletListActive = useActive(editor, BulletListExtension.name);

  const toggleBulletList = useCallback(() => editor.chain().focus().toggleBulletList().run(), [editor]);

  return (
    <Tooltip content="无序列表">
      <Button
        theme={isBulletListActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconList />}
        onClick={toggleBulletList}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
