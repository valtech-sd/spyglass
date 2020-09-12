AFRAME.registerComponent('numbered-text', {
  schema: {
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

    this.el.setAttribute("content-type", {
      contentType: "numbered-text"
    });

    let textContainer = document.createElement('a-entity');
    textContainer.setAttribute('position', "0 0 0");
    this.el.appendChild(textContainer);

    this.textContainer = textContainer;

    // TODO: Make this smaller?
    var title = document.createElement('a-text');
    title.setAttribute('mixin', "body-text");
    title.setAttribute('value', this.data.titleLabel);
    title.setAttribute('position', '0 0 0');

    this.textContainer.appendChild(title);
    this.title = title;


    var body = document.createElement('a-text');
    body.setAttribute('mixin', "body-text");
    body.setAttribute('value', this.data.bodyLabel);


    body.setAttribute('position', '0 -1 0');


    this.textContainer.appendChild(body);
    this.body = body;
  },
  // getWidth: function() {
  //   console.log("width is ", this.width);
  //   return this.width;
  // },
  getHeight: function () {
    // FAKE NUMBER
    return 4;
  },
  update: function () {
  },
  tick: function () {

  },
  remove: function () {
  },
  pause: function () {
  },
  play: function () {
  }
});