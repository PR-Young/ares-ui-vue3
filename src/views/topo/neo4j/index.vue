<template>
  <div class="app-container">
    <div id="svg"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Neo4j',
  data() {
    return {
      links: '',
      links_texts: '',
      nodes: '',
      nodes_labels: '',
      force: '',
    }
  },
  mounted() {
    const width = document.body.clientWidth - 200
    const height = document.body.clientHeight - 200
    const nodes_data = [
      { name: '0', description: '1' },
      { name: '1', description: '2' },
      { name: '2', description: '3' },
      { name: '3', description: '4' },
      { name: '4', description: '5' },
      { name: '5', description: '6' },
      { name: '6', description: '7' },
    ]

    const edges_data = [
      { source: 0, target: 1, relation: '01', value: 1.1 },
      { source: 1, target: 2, relation: '12', value: 1.2 },
      { source: 0, target: 3, relation: '03', value: 1.5 },
      { source: 2, target: 4, relation: '24', value: 0.9 },
      { source: 0, target: 5, relation: '05', value: 1.2 },
      { source: 3, target: 6, relation: '36', value: 1.7 },
      { source: 6, target: 3, relation: '63', value: 1.2 },
    ]
    // Set the range
    const v = d3.scaleLinear().range([0, 100])

    // Scale the range of the data
    v.domain([
      0,
      d3.max(edges_data, function (d) {
        return d.value
      }),
    ])

    edges_data.forEach(function (data) {
      if (v(data.value) <= 25) {
        data.type = 'twofive'
      } else if (v(data.value) <= 50 && v(data.value) > 25) {
        data.type = 'fivezero'
      } else if (v(data.value) <= 75 && v(data.value) > 50) {
        data.type = 'sevenfive'
      } else if (v(data.value) <= 100 && v(data.value) > 75) {
        data.type = 'onezerozero'
      }
    })

    const marge = { top: 60, bottom: 60, left: 60, right: 60 }
    const color = d3.scaleOrdinal(d3.schemeCategory10)
    const edgeWidth = 1
    const svg = d3
      .select('#svg')
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const g = svg
      .append('g')
      .attr('transform', `translate(${marge.top},${marge.left})`)

    const defs = svg.append('defs')
    defs
      .append('marker')
      .attr('id', 'end')
      .attr('viewBox', '0 -5 12 12')
      .attr('refX', 10)
      .attr('refY', -1.5)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
    defs
      .append('marker')
      .attr('id', 'start')
      .attr('viewBox', '0 -5 12 12')
      .attr('refX', 10)
      .attr('refY', -1.5)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0L10,-5L10,5')

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', () => {
          g.attr('transform', d3.event.transform)
        })
    )

    this.force = d3
      .forceSimulation()
      .alphaDecay(0.1)
      .force(
        'collide',
        d3.forceCollide().radius(() => 30)
      )
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))

    this.force
      .nodes(nodes_data)
      .force('link', d3.forceLink(edges_data).distance(200))
      .alpha(1)
      .restart()

    this.links = g
      .append('g')
      .selectAll('path')
      .data(edges_data)
      .enter()
      .append('path')
      .attr('class', function (d) {
        return 'link ' + d.type
      })
      .attr('id', function (d, i) {
        return 'path' + i
      })
      .attr('marker-end', 'url(#end)')
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', 2)

    this.links_texts = g
      .append('g')
      .selectAll('.edgelabel')
      .data(edges_data)
      .enter()
      .append('text')
      .text((d) => d.relation)

    //节点
    this.nodes = g
      .append('g')
      .selectAll('circle')
      .data(nodes_data)
      .enter()
      .append('circle')
      .attr('r', 40)
      .style('fill', function (d, i) {
        return color(i)
      })
      .call(
        d3
          .drag()
          .on('start', this.started)
          .on('drag', this.dragged)
          .on('end', this.ended)
      )

    //标签
    this.nodes_labels = g
      .append('g')
      .selectAll('text')
      .data(nodes_data)
      .enter()
      .append('text')
      .attr('dx', function (d, i) {
        return -16 * nodes_data[i].name.length
      })
      .attr('dy', 5)
      .attr('fill', '#fff')
      .style('font-size', 16)
      .text((d) => d.description)

    //运动刷新
    this.force.on('tick', this.ticked)
  },
  methods: {
    ticked: function (d) {
      this.links
        .attr('d', function (d, i) {
          const distance = Math.sqrt(
            (d.target.y - d.source.y) * (d.target.y - d.source.y) +
              (d.target.x - d.source.x) * (d.target.x - d.source.x)
          )
          const x_distance = ((d.target.x - d.source.x) / distance) * 40
          const y_distance = ((d.target.y - d.source.y) / distance) * 40
          const x1 = d.source.x + x_distance
          const y1 = d.source.y + y_distance
          const x2 = d.target.x - x_distance
          const y2 = d.target.y - y_distance
          const dx = d.target.x - d.source.x
          const dy = d.target.y - d.source.y
          const r = Math.sqrt(dx * dx + dy * dy)

          if (x1 < x2) {
            return (
              'M' +
              x1 +
              ',' +
              y1 +
              'A' +
              r +
              ',' +
              r +
              ' 0 0,1 ' +
              x2 +
              ',' +
              y2
            )
          } else {
            return (
              'M' +
              x2 +
              ',' +
              y2 +
              'A' +
              r +
              ',' +
              r +
              ' 0 0,0 ' +
              x1 +
              ',' +
              y1
            )
          }
        })
        .attr('marker-end', function (d) {
          if (d.source.x < d.target.x) {
            return 'url(#end)'
          }
          return ''
        })
        .attr('marker-start', function (d) {
          if (d.source.x >= d.target.x) {
            return 'url(#start)'
          }
          return ''
        })

      // this.node.attr("transform", function (d) {
      //   return "translate(" + d.x + "," + d.y + ")";
      // });

      this.nodes
        .attr('cx', function (d) {
          return d.x
        })
        .attr('cy', function (d) {
          return d.y
        })

      this.links_texts.attr('dominant-baseline', function (d) {
        if (d.source.x < d.target.x) {
          return 'text-after-edge'
        }
        return 'text-before-edge'
      })

      this.links_texts.attr('x', function (d) {
        return (d.source.x + d.target.x) / 2
      })

      this.links_texts.attr('y', function (d) {
        return (d.source.y + d.target.y) / 2
      })

      this.nodes_labels.attr('x', function (d) {
        return d.x
      })
      this.nodes_labels.attr('y', function (d) {
        return d.y
      })
    },
    started: function (d) {
      if (!d3.event.active) {
        this.force.alphaTarget(0.8).restart()
      }
      d.fx = d.x
      d.fy = d.y
    },
    dragged: function (d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    },
    ended: function (d) {
      if (!d3.event.active) {
        this.force.alphaTarget(0)
      }
      d.fx = null
      d.fy = null
    },
  },
}
</script>

<style>
path.link {
  fill: none;
  stroke: #666;
  stroke-width: 1.5px;
}
path.link.twofive {
  opacity: 0.25;
}
path.link.fivezero {
  opacity: 0.5;
}
path.link.sevenfive {
  opacity: 0.75;
}
path.link.onezerozero {
  opacity: 1;
}
circle {
  fill: #ccc;
  stroke: #fff;
  stroke-width: 1.5px;
}
text {
  fill: #000;
  font: 10px sans-serif;
  pointer-events: none;
}
</style>
