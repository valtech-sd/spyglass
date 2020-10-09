// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component

AFRAME.registerComponent('content-group', {
  schema: {
    contentSpacing: {
      type: 'number',
      default: 1
    }
  },
  init: function () {
    this.spacing = this.data.contentSpacing;
  },
  initLayout: function() {
    // this.contentElements = this.el.querySelectorAll('[content-type]');
    this.contentElements = this.el.querySelectorAll('[textwithicon], [numbered-text], [text-paragraph-bar]');
    let self = this;

    var contentHeightSoFar = 0;
    this.contentElements.forEach( function(el, index) {

      // Unsure why it wasn't working the other way...with content type
      // AHHHHH.
      // don't hold this against me
      let contentComponent = el.components["textwithicon"]
      let contentHeight = 8
      if (contentComponent == undefined) {
        contentComponent = el.components["numbered-text"]
        contentHeight = 4
      }
      if (contentComponent == undefined) {
        contentComponent = el.components["text-paragraph-bar"]
        contentHeight = 8
      }

      // let contentHeight = contentComponent.getHeight();
      el.object3D.position.y = contentHeightSoFar;

      // Content grows down
      // contentHeightSoFar += -self.spacing - contentHeight;
      contentHeightSoFar += -contentHeight;
      // console.log("content height so far: ", contentHeightSoFar);
    })
  },
  // TODO: Have some smarter way of adding data
  initializeFromData(data) {

    let self = this

    data.forEach(function (content){
      let hasTitle = content.title != null

      // Create a content element
      var contentEl = document.createElement('a-entity');

      contentEl.setAttribute("content-type", {
        contentType: content.type
      });

      // This could be better
      switch (content.type) {
        case "numbered-text":
          // console.log("Adding numbered text")
          contentEl.setAttribute(content.type, {
            titleLabel: content.title,
            bodyLabel: content.body
          });
          break;
        case "textwithicon":
          // console.log("adding text with icon")
          contentEl.setAttribute(content.type, {
            hasTitle: hasTitle,
            icon: content.icon,
            titleLabel: content.title,
            bodyLabel: content.body
          });
          break;
        case "text-paragraph-bar":
          // console.log("adding text with bar")
          contentEl.setAttribute(content.type, {
            titleLabel: content.title,
            bodyLabel: content.body
          });
          break;
        default:
          break;
      }

      self.el.appendChild(contentEl);
    })

    this.initLayout()
  },
  update: function () {},
  tick: function () {

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});