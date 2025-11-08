import Quill from 'quill';
const QuillAny = Quill as any;
const BlockEmbed = QuillAny.import('blots/block/embed');

export class AudioBlot extends BlockEmbed {
  static blotName = 'audio';
  static tagName = 'audio';

  static create(value: string) {
    const node = super.create();
    node.setAttribute('controls', '');
    node.setAttribute('src', value);
    return node;
  }

  static value(node: HTMLAudioElement) {
    return node.getAttribute('src') || '';
  }
}

export class VideoBlot extends BlockEmbed {
  static blotName = 'video';
  static tagName = 'video';

  static create(value: string) {
    const node = super.create();
    node.setAttribute('controls', '');
    node.setAttribute('src', value);
    node.setAttribute('width', '400');
    return node;
  }

  static value(node: HTMLVideoElement) {
    return node.getAttribute('src') || '';
  }
}

QuillAny.register(AudioBlot);
QuillAny.register(VideoBlot);
