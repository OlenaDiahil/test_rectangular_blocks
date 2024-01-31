import { efficientPlacement } from './algorithms/efficientPlacement.js';
import Render from './render/render.js';

import Block from './components/block.js';
import Container from './components/container.js';

import { getRandomColor } from './utils/generateColor.js';
import { debounce } from './utils/debounce.js';
import { loadJson } from './utils/loadJson.js';

const DEBOUNCE_DELAY = 50;

let containerElement;

let errorAlertShown = false;


async function handleResize(container) {
  const newWidth = containerElement.clientWidth;
  const newHeight = containerElement.clientHeight;

  container.width = newWidth;
  container.height = newHeight;

  try {
    await updateBlocks(container);
  } catch (error) {
    console.error(error);
    if (!errorAlertShown) {
      showErrorAlert('Some blocks could not be placed in the container');
      errorAlertShown = true;
    }
  }
}

async function updateBlocks(container) {
  const blocks = await loadJson('json/blocks.json');
  const data = efficientPlacement(blocks, container);

  if (blocks.length !== data.blockCoordinates.length && !errorAlertShown) {
    showErrorAlert('Some blocks could not be placed in the container');
    errorAlertShown = true;
  } else if (blocks.length === data.blockCoordinates.length && errorAlertShown) {
    // Всі блоки поміщаються в контейнер, скидання флагу помилки
    errorAlertShown = false;
    hideErrorAlert();
  }

  Render.renderFullness(data.fullness, containerElement);
  renderBlocks(data, containerElement);
}

function hideErrorAlert() {
  const errorAlert = document.querySelector('.error-alert');
  if (errorAlert) {
    errorAlert.remove();
  }
}

function renderBlocks(data, containerElement) {
  containerElement.innerHTML = '';

  data.blockCoordinates.forEach((coord) => {
    const width = coord.right - coord.left;
    const height = coord.bottom - coord.top;

    const block = new Block(
      width,
      height,
      coord.initialOrder,
      getRandomColor(width, height),
      { ...coord }
    );

    Render.renderBlock(block, containerElement);
  });
}

function showErrorAlert(message) {
  const errorAlert = document.createElement('div');
  errorAlert.className = 'error-alert';
  errorAlert.textContent = message;

  containerElement.insertAdjacentElement('afterend', errorAlert);
}

async function main() {
  containerElement = document.getElementById('container');
  const container = new Container(containerElement.clientWidth, containerElement.clientHeight);

  await updateBlocks(container);

  const observer = new MutationObserver(() => handleResize(container));
  observer.observe(containerElement, { attributes: true, childList: true, subtree: true });

  window.addEventListener('resize', debounce(() => handleResize(container), DEBOUNCE_DELAY));
}

main();
