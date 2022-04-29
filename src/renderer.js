import tag from 'html5-tag';

function myRenderer (node) {
  return tag('div', {
    'data-id': node.id,
    'class': 'elem-item'
}, node.id);
}

export default myRenderer;