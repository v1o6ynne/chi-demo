# cortex-app
(react + D3.js)

npm install
npm start

-to do list:
working on integrating with vega + FastAPI:

{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "data": [
    {
      "name": "heatmap_data",
      "url": "http://localhost:8000/heatmap-data",
      "format": {"type": "csv"}
    }
  ],
  "marks": [
    {
      "type": "rect",
      "from": {"data": "heatmap_data"},
      "encode": {
        "enter": {
          "x": {"field": "column_x", "type": "ordinal"},
          "y": {"field": "column_y", "type": "ordinal"},
          "fill": {"field": "value", "type": "quantitative"}
        },
        "update": {
          "tooltip": {"signal": "'<img src=' + datum.image + ' width=50>'"}
        }
      }
    }
  ]
}
