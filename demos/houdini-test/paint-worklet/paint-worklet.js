registerPaint('tab', class {
  static get inputProperties() {
    return [
      'background-color',
      'border-image-outset',
      '--tab-multiplier',
    ];
  }

  static get inputArguments() {
    return ['*'];
  }

  paint(ctx, size, props, args) {
    const bkg = props.get('background-color');
    const offset = parseInt(props.get('border-image-outset').toString());
    const m = props.get('--tab-multiplier').value;
    const sides = args[0].toString();

    const x = 10 * m;
    const y = 5.6 * m;

    if (sides === 'right' || sides === 'middle') {
      const yoff = size.height - offset - x;
      const xoff = offset - x;

      ctx.beginPath();
      ctx.moveTo(0.0 + xoff, x + yoff);
      ctx.lineTo(x + xoff, x + yoff);
      ctx.lineTo(x + xoff, 0.0 + yoff);
      ctx.bezierCurveTo(x + xoff, y + yoff, y + xoff, x + yoff, 0.0 + xoff, x + yoff);
      ctx.closePath();
      ctx.fillStyle = bkg;
      ctx.fill();
    }

    if (sides === 'left' || sides === 'middle') {
      const yoff = size.height - offset - x;
      const xoff = size.width - offset;

      ctx.beginPath();
      ctx.moveTo(x + xoff, x + yoff);
      ctx.lineTo(0.0 + xoff, x + yoff);
      ctx.lineTo(0.0 + xoff, 0.0 + yoff);
      ctx.bezierCurveTo(0.0 + xoff, y + yoff, y + xoff, x + yoff, x + xoff, x + yoff);
      ctx.closePath();
      ctx.fillStyle = bkg;
      ctx.fill();
    }
  }
});
