export class Loading {
    element: HTMLSpanElement
    div: HTMLDivElement
    constructor() {
        this.element = document.createElement('span') as HTMLSpanElement
        this.element.textContent = 'Loading...';
        this.element.classList.add('text');
        this.element.style.left = (window.innerWidth - this.element.clientWidth).toString() + 'px';
        this.element.style.top = '0px';
        this.div = document.getElementById('loadingArea') as HTMLDivElement;
        this.div.append(this.element);
    }
    onResize(ev?: UIEvent) {
        this.element.classList.add('text');
        this.element.style.left = (window.innerWidth - this.element.clientWidth).toString() + 'px';
    }
    destroy() {
        this.div.removeChild(this.element);
    }
}