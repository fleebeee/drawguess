import React, { useState, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';

const width = 500;
const height = 500;

const drawBrush = (ctx, x, y, prevX, prevY) => {
  ctx.beginPath();
  ctx.ellipse(x, y, 10, 10, 0, 0, 2 * Math.PI);

  // If brush is already down, tween the positions
  // Approximately one ellipse per pixel
  if (prevX && prevY) {
    const xd = x - prevX;
    const yd = y - prevY;
    const d = Math.sqrt(Math.abs(xd) + Math.abs(yd));
    const count = Math.ceil(d);

    for (let i = 0; i < count; ++i) {
      ctx.ellipse(
        x - (i / count) * xd,
        y - (i / count) * yd,
        10,
        10,
        0,
        0,
        2 * Math.PI
      );
    }
  }

  ctx.fill();
};

const Drawboard = () => {
  const [initialized, setInitialized] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [boundings, setBoundings] = useState<DOMRect>();
  const [prevX, setPrevX] = useState(null);
  const [prevY, setPrevY] = useState(null);
  const prevXRef = useRef();
  prevXRef.current = prevX;
  const prevYRef = useRef();
  prevYRef.current = prevY;
  const ctxRef = useRef<CanvasRenderingContext2D>();
  ctxRef.current = ctx;
  const bRef = useRef<DOMRect>();
  bRef.current = boundings;
  const isDrawingRef = useRef<boolean>(false);
  isDrawingRef.current = isDrawing;

  const getXY = (event) => {
    return [
      event.clientX - bRef.current.left,
      event.clientY - bRef.current.top,
    ];
  };

  //   // Handle Colors
  //   var colors = document.getElementsByClassName('colors')[0];

  //   colors.addEventListener('click', function(event) {
  //     context.strokeStyle = event.target.value || 'black';
  //   });

  //   // Handle Brushes
  //   var brushes = document.getElementsByClassName('brushes')[0];

  //   brushes.addEventListener('click', function(event) {
  //     context.lineWidth = event.target.value || 1;
  //   });

  useLayoutEffect(() => {
    const can = document.getElementById('drawboard') as HTMLCanvasElement;
    const con = can.getContext('2d');

    setCanvas(can);
    con.fillStyle = '#FFFFFF';
    con.fillRect(0, 0, width, height);
    con.lineWidth = 10;
    setCtx(con);

    setBoundings(can.getBoundingClientRect());

    con.fillStyle = 'black'; // initial brush color
    con.lineWidth = 1; // initial brush width

    can.addEventListener('mousedown', (event) => {
      const [x, y] = getXY(event);
      setIsDrawing(true);

      // Draw initial dot
      drawBrush(ctxRef.current, x, y, prevX, prevY);

      setPrevX(x);
      setPrevY(y);
    });

    can.addEventListener('mousemove', (event) => {
      const [x, y] = getXY(event);

      if (isDrawingRef.current) {
        drawBrush(ctxRef.current, x, y, prevXRef.current, prevYRef.current);

        setPrevX(x);
        setPrevY(y);
      }
    });

    can.addEventListener('mouseup', function (event) {
      setIsDrawing(false);
      setPrevX(null);
      setPrevY(null);
    });
    // TODO Remove listeners
  }, []);
  // Mouse Down Event

  //   // Mouse Move Event

  //   // Mouse Up Event

  //   // Handle Mouse Coordinates
  //   function setMouseCoordinates(event) {
  //     mouseX = event.clientX - boundings.left;
  //     mouseY = event.clientY - boundings.top;
  //   }

  //   // Handle Clear Button
  //   var clearButton = document.getElementById('clear');

  //   clearButton.addEventListener('click', function() {
  //     context.clearRect(0, 0, canvas.width, canvas.height);
  //   });

  //   // Handle Save Button
  //   var saveButton = document.getElementById('save');

  //   saveButton.addEventListener('click', function() {
  //     var imageName = prompt('Please enter image name');
  //     var canvasDataURL = canvas.toDataURL();
  //     var a = document.createElement('a');
  //     a.href = canvasDataURL;
  //     a.download = imageName || 'drawing';
  //     a.click();
  //   });
  // };

  return <Canvas id="drawboard" width={width} height={height} />;
};

const Canvas = styled.canvas`
  margin: 0 auto;
  display: flex;
  width: ${width}px;
  height: ${height}px;
  // cursor: url(./myCursor.cur), none;
`;

export default Drawboard;
