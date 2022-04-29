class InfiniteTable {

  el = null;

  scrollElement = null;

  contentElement = null;

  rows = [];

  cache = {};

  options = {
    rowsInBlock: 10,
    blocksInCluster: 4,
    rowRender: null,
    data: []
  };

  state = {
    lastClusterIndex: -1,
    itemHeight: 0,
    blockHeight: 0,
    clusterHeight: 0
  };

  constructor(el, options) {
    this.el = el;

    console.log(options)
    this.options = {
      ...this.options,
      ...options
    }

    this.create()
    this.loadData(this.options.data)
  }

  create () {
    if (this.el) {
      this.scrollElement = document.createElement('div');
      const contentElement = document.createElement('div');
      this.scrollElement.appendChild(contentElement);
      this.contentElement = contentElement;

      this.scrollElement.className = 'elem-scroll'
      this.contentElement.className = 'elem-content'
      this.el.appendChild(this.scrollElement)

      const scrollTop = this.scrollElement.scrollTop;
      this.changeDOM();
      // Restore scroll position
      this.scrollElement.scrollTop = scrollTop;

      // 滚动的监听事件
      this.scrollElement.addEventListener('scroll', () => {
        const clusterIndex = this.getCurrentClusterIndex();
        console.log('clusterIndex', clusterIndex)
        
        if (this.state.lastClusterIndex !== clusterIndex) {
            this.changeDOM();
        }
        this.state.lastClusterIndex = clusterIndex;
  })
    }
  }

  update () {
    const scrollTop = this.scrollElement.scrollTop
    if (this.state.itemHeight * this.rows.length < scrollTop) {
      this.scrollElement.scrollTop = 0;
      this.state.lastClusterIndex = 0;
    }

    this.changeDOM()
    this.scrollElement.scrollTop = scrollTop;
  }

  loadData (rows) {
    this.rows = rows
    if (!this.rows || this.rows.length === 0) {
      return 
    }
    this.rows = rows.map(r => this.options.rowRender(r))
    this.changeDOM()
  }

  changeDOM () {
    if (!this.state.clusterHeight && this.rows.length > 0) {

      if (this.contentElement.children.length <= 1) {
        this.cache.content = this.setContent(this.rows[0] + this.rows[0] + this.rows[0]);
      }

      this.state = { ...this.state, ...this.computeHeight() };
    }

    let topOffset = 0;
    let bottomOffset = 0;
    let rows = [];

    if (this.rows.length < this.options.rowsInBlock) {
      rows = (this.rows.length > 0) ? this.rows : this.generateEmptyRow();
    } else {
      const rowsInCluster = this.options.rowsInBlock * this.options.blocksInCluster;
      console.log('rowsInCluster', rowsInCluster)
      const clusterIndex = this.getCurrentClusterIndex();
      // 渲染的开始索引
      const visibleStart = Math.max((rowsInCluster - this.options.rowsInBlock) * clusterIndex, 0);
      // 渲染的结束索引
      const visibleEnd = visibleStart + rowsInCluster;

      topOffset = Math.max(visibleStart * this.state.itemHeight, 0);
      bottomOffset = Math.max((this.rows.length - visibleEnd) * this.state.itemHeight, 0);

      // Returns a shallow copy of the rows selected from `visibleStart` to `visibleEnd` (`visibleEnd` not included).
      rows = this.rows.slice(visibleStart, visibleEnd);
    }

    let layout = [];

    if (topOffset > 0) {
      if (this.options.keepParity) {
        layout.push(this.renderExtraTag('keep-parity'));
      }
      layout.push(this.renderExtraTag('top-space', topOffset));
    }
    layout.push(...rows);
    if (bottomOffset > 0) {
        layout.push(this.renderExtraTag('bottom-space', bottomOffset));
    }
    this.setContent(layout.join(''))
  }

  computeHeight () {
    if (!this.rows.length) {
      return {
          clusterHeight: 0,
          blockHeight: this.state.blockHeight,
          itemHeight: this.state.itemHeight
      };
    } else {
        const nodes = this.contentElement.children;
        const node = nodes[Math.floor(nodes.length / 2)];

        // 树节点的高度
        let itemHeight = node.offsetHeight;

        // 21 * 50 = 1050
        const blockHeight = itemHeight * this.options.rowsInBlock;
        // 1050 * 4 = 4200
        const clusterHeight = blockHeight * this.options.blocksInCluster;

        return {
            itemHeight,
            blockHeight,
            clusterHeight
        };
    }
  }

  setContent(content) {
    this.contentElement.innerHTML = content;
  }

  generateEmptyRow() {
    const emptyRow = document.createElement('div');
    emptyRow.className = 'emptyClass';
    emptyRow.appendChild(document.createTextNode('No Data'));
    return [emptyRow.outerHTML];
  }

  getCurrentClusterIndex() {
    const { blockHeight, clusterHeight } = this.state;
    if (!blockHeight || !clusterHeight) {
        return 0;
    }
    return Math.floor(this.scrollElement.scrollTop / (clusterHeight - blockHeight)) || 0;
  }

  renderExtraTag(className, height) {
      const tag = document.createElement('div');
      const prefix = 'infinite-tree-';

      tag.className = [
          prefix + 'extra-row',
          prefix + className
      ].join(' ');

      if (height) {
          tag.style.height = height + 'px';
      }

      return tag.outerHTML;
  }

}

export default InfiniteTable;