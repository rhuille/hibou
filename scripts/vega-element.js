/**
 * This module define a new custom HTML element: 
 * `<vega-element src="https://vega.github.io/vega/examples/bar-chart.vg.json"></vega-element>`
 */

import "https://cdn.jsdelivr.net/npm/vega@5.19.1/build/vega.min.js";
import "https://cdn.jsdelivr.net/npm/vega-lite@4.17.0/build/vega-lite.min.js";


class VegaElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.mainContainer = document.createElement('div');
    this.shadowRoot.appendChild(this.mainContainer);
    this.mainContainer.innerText = 'loading ...'
  }

  getSpecFromTextContent = JSON.parse;
  getSpecFromSrc = async (url) => (await(await fetch(url)).json());

  async getSpecFromSrcAndTextContent(){
    const src = this.getAttribute('src');
    const textContent = this.textContent;

    if(src == null && textContent == '') {
      throw 'src and text content cannot be both empty'
    } else if (src != null && textContent.trim() != '') {
      throw 'src and text content cannot be both not empty'
    } else if (src == null && textContent != ''){
      return this.getSpecFromTextContent(textContent)
    } else {
      return this.getSpecFromSrc(src);
    }
  }

  async connectedCallback() {
    try {
      const spec = await this.getSpecFromSrcAndTextContent();
      await new vega.View(
        vega.parse(this.getAttribute('lite') != null ? vegaLite.compile(spec).spec : spec), 
        {
          renderer: 'svg',
          container: this.mainContainer,
          hover: true
        }
      ).runAsync();

    } catch(e) {
      console.error(e)
      this.mainContainer.style.fontFamily = 'mono';
      this.mainContainer.style.border = '1px solid red';
      this.mainContainer.innerText = `Something went wrong: ${e}`
    }
  }
}

customElements.define('vega-element', VegaElement);
