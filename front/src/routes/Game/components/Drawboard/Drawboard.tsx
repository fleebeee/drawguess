import React, { useState, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';

const width = 500;
const height = 500;

const Drawboard = () => {
  const [initialized, setInitialized] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [boundings, setBoundings] = useState<DOMRect>();
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
    setCtx(con);
    con.fillStyle = '#FFFFFF';
    con.fillRect(0, 0, width, height);

    setBoundings(can.getBoundingClientRect());

    con.strokeStyle = 'black'; // initial brush color
    con.lineWidth = 1; // initial brush width

    can.addEventListener('mousedown', (event) => {
      const [x, y] = getXY(event);
      setIsDrawing(true);

      // Start Drawing
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x, y);
    });

    can.addEventListener('mousemove', (event) => {
      const [x, y] = getXY(event);

      if (isDrawingRef.current) {
        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();
      }
    });

    can.addEventListener('mouseup', function (event) {
      setIsDrawing(false);
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
