declare module 'quill' {
    export default class Quill {
        constructor(container: string | HTMLElement, options?: any);
        getContents(): any;
        setContents(delta: any): void;
        on(eventName: string, callback: Function): void;
    }

    export class Delta {
        constructor(ops?: any);
        ops: any[];
    }
}
