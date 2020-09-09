# A Frame Text & Images
This sample reviews how to implement text and images in an A-Frame application.

## **Rendering Text**
[A Frame Text Documentation](https://aframe.io/docs/1.0.0/components/text.html#custom-fonts)

A-Frame has a default implementation of text components using SDF-based text. The component is based on the `<a-entity>` tag, as seen below

`<a-entity text="value: Hello World;"></a-entity>`

### Key Properties
* position: the text closer or farther away
* scale: defines a shrinking, stretching, or skewing transformation of an entity for the X, Y, and Z axes
* text: the text object to layout
    * align: multi-line text alignment (left, center, right)
    * color: text color
    * value: the actual content of the text. Line breaks and tabs are supported with \n and \t
    * width: desired width of the text box
* font: the font to render text, either the name of one of A-Frame's stock fonts or a URL to a font file

### Fonts
The default text component renders `roboto`, which uses multi-channel signed distance (MSDF) font.

[List of A-Frame Stock Fonts](https://aframe.io/docs/1.0.0/components/text.html#stock-fonts)

### Font Sizing
There are multiple ways to change the font size of a text component, primarily the `scale` and `position` properties.

[Sizing Fonts in A-Frame](https://aframe.io/docs/1.0.0/components/text.html#sizing)


## **Rendering Images**
[A Frame Image Documentation](https://aframe.io/docs/1.0.0/primitives/a-image.html#sidebar)