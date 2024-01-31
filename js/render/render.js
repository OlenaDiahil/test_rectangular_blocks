class Render {
    static renderFullness(fullness, containerElement) {
        let existedElem = document.querySelector('.fullness');

        if (!existedElem) {
            existedElem = document.createElement('p');
            existedElem.className = 'fullness';
            document.body.insertBefore(existedElem, containerElement);
        }

        existedElem.textContent = `Fullness: ${Math.round(fullness * 100)}`;
    }

    static renderBlock(block, containerElement) {
        const blockElement = document.createElement('div');
        blockElement.className = 'block';
        blockElement.style.width = block.width + 'px';
        blockElement.style.height = block.height + 'px';

        blockElement.style.top = block.coords.top + 'px';
        blockElement.style.right = block.coords.right + 'px';
        blockElement.style.bottom = block.coords.bottom + 'px';
        blockElement.style.left = block.coords.left + 'px';

        blockElement.style.backgroundColor = block.color;
        blockElement.textContent = block.initialOrder;

        containerElement.appendChild(blockElement);
    }
}

export default Render;
