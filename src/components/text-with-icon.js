

AFRAME.registerComponent('textwithicon', {
  schema: {
    hasTitle: {
      type: 'boolean',
      default: true
    },
    icon: {
      type: 'string',
      default: '#benefits'
    },
    titleLabel: {
      type: 'string',
      default: 'YLANG YLANG'
    },
    bodyLabel: {
      type: 'string',
      default: "Sweet, exotic and floral, essential oil distilled from the fragrant flowers."
    },
  },
  init: function () {

    // For now, it's a circle
    var icon = document.createElement('a-circle');
    icon.setAttribute("color", "#74fab9");
    icon.setAttribute("radius", 1.5);
    icon.setAttribute("segments", 128);
    icon.setAttribute("opacity", 1.0);
    icon.setAttribute("position", "1 0 0");
    this.el.appendChild(icon);

    // Add a circle
    if (this.data.icon != "") {
      let iconImage = document.createElement('a-image');
      iconImage.setAttribute("src", this.data.icon);
      iconImage.setAttribute("opacity", 1.0);
      iconImage.setAttribute("scale", "2 2 2");
      iconImage.setAttribute("color", "black");
      iconImage.setAttribute("position", "0 0 1");

      icon.appendChild(iconImage);
    }

    this.icon = icon;

    let textContainer = document.createElement('a-entity');
    textContainer.setAttribute('position', "0 -2.25 0");
    this.el.appendChild(textContainer);

    this.textContainer = textContainer;

    if (this.data.hasTitle) {
      var title = document.createElement('a-text');
      title.setAttribute('mixin', "body-text");
      title.setAttribute('value', this.data.titleLabel);
      title.setAttribute('position', '0 0 0');

      this.textContainer.appendChild(title);
      this.title = title;
    }

    var body = document.createElement('a-text');
    body.setAttribute('mixin', "body-text");
    body.setAttribute('value', this.data.bodyLabel);

    if (this.data.hasTitle) {
      body.setAttribute('position', '0 -1 0');
    } else {
      body.setAttribute('position', '0 0 0');
    }

    this.textContainer.appendChild(body);
    this.body = body;

    // Compute width
    // TODO: Also include text size
    // let textAttr = text.components.value
    //
    // let textWidth = text.getAttribute("value")
    //   //.data.length
    //   //* (textAttr.data.width / textAttr.data.wrapCount);
    // this.width = Math.max(icon.getAttribute("width"), textWidth);
    // this.width = icon.getAttribute("width")
  },
  // getWidth: function() {
  //   console.log("width is ", this.width);
  //   return this.width;
  // },
  getHeight: function() {

    // Get height of body text
    // TODO: Replace 2.25 with icon height + spacing
    var h =  2.25 + 5;

      //+ this.body.height;

    // let bodyText = this.body.components.text
    // let bodyHeight = this.body.getAttribute("height");
    // console.log("body");
    // console.log(this.body);
    // bodyText.updateLayout();
    //
    // console.log("geo")
    // console.log(bodyText.geometry)
    // console.log(bodyText.geometry.height)
    // // console.log(this.body.components.text);
    // console.log(bodyText.data);


    if (this.hasTitle) {
      // h += this.title.height + 1;
      h += 1.5;
    }

    // console.log("height is " + h);

    // Fake number for now
    return h;
    // return 5;

  },
  configure: function(titleName, textBody, iconUrl) {

  },
  update: function () {},
  tick: function () {

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});