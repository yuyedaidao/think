import { useCallback } from 'react';
import { Editor } from '@tiptap/core';
import { Space, Button, Popover, Typography } from '@douyinfe/semi-ui';
import { IconCopy, IconDelete } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { IconDrawBoard } from 'components/icons';
import { BubbleMenu } from 'tiptap/views/bubble-menu';
import { Divider } from 'tiptap/divider';
import { Callout } from 'tiptap/extensions/callout';
import { copyNode, deleteNode } from 'tiptap/prose-utils';
import styles from './bubble.module.scss';

const { Text } = Typography;

const TEXT_COLORS = ['#d83931', '#de7802', '#dc9b04', '#2ea121', '#245bdb', '#6425d0', '#646a73'];
const BORDER_COLORS = ['#fbbfbc', '#fed4a4', '#fff67a', '#b7edb1', '#bacefd', '#cdb2fa', '#dee0e3'];
const BACKGROUND_COLORS = ['#fef1f1', '#feead2', '#ffc', '#d9f5d6', '#e1eaff', '#ece2fe', '#f2f3f5'];

export const CalloutBubbleMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
  const setColor = useCallback(
    (key, color) => {
      return () => {
        editor
          .chain()
          .updateAttributes(Callout.name, {
            [key]: color,
          })
          .focus()
          .run();
      };
    },
    [editor]
  );

  const copyMe = useCallback(() => copyNode(Callout.name, editor), [editor]);
  const deleteMe = useCallback(() => deleteNode(Callout.name, editor), [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="calloyt-bubble-menu"
      shouldShow={() => editor.isActive(Callout.name)}
      matchRenderContainer={(node) => node && node.id === 'js-bannber-container'}
    >
      <Space spacing={4}>
        <Tooltip content="复制">
          <Button onClick={copyMe} icon={<IconCopy />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>

        <Popover
          spacing={10}
          style={{ padding: '0 12px 12px', overflow: 'hidden' }}
          content={
            <>
              <section className={styles.colorWrap}>
                <Text type="secondary">字体颜色</Text>
                <div>
                  {TEXT_COLORS.map((color) => (
                    <div
                      key={color}
                      className={styles.color}
                      style={{ color: color }}
                      onClick={setColor('textColor', color)}
                    >
                      A
                    </div>
                  ))}
                </div>
              </section>
              <section className={styles.colorWrap}>
                <Text type="secondary">边框颜色</Text>

                <div>
                  {BORDER_COLORS.map((color) => (
                    <div
                      key={color}
                      className={styles.color}
                      style={{ backgroundColor: color }}
                      onClick={setColor('borderColor', color)}
                    ></div>
                  ))}
                </div>
              </section>
              <section className={styles.colorWrap}>
                <Text type="secondary">背景颜色</Text>
                <div>
                  {BACKGROUND_COLORS.map((color) => (
                    <div
                      key={color}
                      className={styles.color}
                      style={{ backgroundColor: color }}
                      onClick={setColor('backgroundColor', color)}
                    ></div>
                  ))}
                </div>
              </section>
            </>
          }
        >
          <Button icon={<IconDrawBoard />} type="tertiary" theme="borderless" size="small" />
        </Popover>

        <Divider />

        <Tooltip content="删除" hideOnClick>
          <Button size="small" type="tertiary" theme="borderless" icon={<IconDelete />} onClick={deleteMe} />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
