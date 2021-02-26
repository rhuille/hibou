# Hibou 🦉

Hibou is a simple viewer for markdown page.

It makes easy to create and share an article with data visualization in it.

&nbsp; ✔️ Articles are written in [markdown](https://markdown-it.github.io) \
&nbsp; *Html works fine too*

&nbsp; ✔️ Dataviz are rendered with [vega](https://vega.github.io/vega) \
&nbsp; *You can also use other libraries like [d3](https://d3js.org/) or [raphael](https://dmitrybaranovskiy.github.io/raphael/)*

&nbsp; ✔️ Stored on [github gist](https://gist.github.com) \
&nbsp; *You can still propose a new connector to an other storage*

## How it works

Write your article in markdown and store on a gist within an `index.md` file.
You can then visualize it go on: `http://0.0.0.0:8080/#/gist/{gist_id}`

For example, this gist:

https://gist.github.com/rhuille/4ee50b80364d1f2de18ac708ae91c7ec

can be visualized with Hibou here:

http://0.0.0.0:8080/#/gist/4ee50b80364d1f2de18ac708ae91c7ec


## Use Vega in markdown

Hibou improves markdown with a custom html element `<vega-element>`, which instantiates [Vega visualization](https://vega.github.io/vega).

For example:

```
<vega-element src="https://vega.github.io/vega/examples/bar-chart.vg.json"></vega-element>
```

will render:

<vega-element src="https://vega.github.io/vega/examples/bar-chart.vg.json">
</vega-element>


You can also use vega-lite spec setting the `lite` attribute:

```
<vega-element lite src="https://raw.githubusercontent.com/vega/vega-lite/master/examples/specs/bar.vl.json"></vega-element>
```

<vega-element lite src="https://raw.githubusercontent.com/vega/vega-lite/master/examples/specs/bar.vl.json"></vega-element>

And you can also write the spec directly inside the html:

```html
<vega-element lite>
  {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "description": "A simple bar chart with embedded data.",
    "data": {
      "values": [
        {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
        {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
        {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
      ]
    },
    "mark": "bar",
    "encoding": {
      "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
      "y": {"field": "b", "type": "quantitative"}
    }
  }
</vega-element>
```

<br>

*✏️ The `vega-element` is fully supported by Firefox (version 63), Chrome, and Opera and partially by Safari. It is a web-component cf. [here](https://developer.mozilla.org/en-US/docs/Web/Web_Components#browser_compatibility) the full details.*


## Credits

- Hibou is highly inspired from https://bl.ocks.org/-/about
- Hibou uses [markdown-it](https://github.com/markdown-it/markdown-it) to transform the markdown content into html.
- Hibou is hosted on [github pages](https://pages.github.com/)
