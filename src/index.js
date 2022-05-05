const InfiniteTable = require('./infinite-table').default
const defaultRowRenderer = require('./renderer').default
import './index.css'

let listData = [];
for (let i = 0; i < 1000; i++) {
  listData.push({
    id: i,
    name: i
  })
}

function initTable () {
  const tree = document.createElement('div')
  tree.style.height = '100px'
  tree.style.background="green"

  new InfiniteTable(tree, {
    data: listData,
    rowRender: defaultRowRenderer
  })

  window.document.body.appendChild(tree)
}

initTable()