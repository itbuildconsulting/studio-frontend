import { toPng } from "html-to-image";

export async function exportNodeAsPng(node: HTMLElement, filename: string) {
    const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
