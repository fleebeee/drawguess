import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
} from 'react';
import styled from 'styled-components';
import CommonContext from '~utils/CommonContext';

import Controls from './Controls';

const width = 500;
const height = 500;

const drawBrush = (ctx, x, y, prevX, prevY) => {
  ctx.beginPath();
  ctx.moveTo(prevX || x, prevY || y);
  ctx.lineTo(x, y);
  ctx.stroke();
};

const Drawboard = () => {
  const [initialized, setInitialized] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [boundings, setBoundings] = useState<DOMRect>();
  const [prevX, setPrevX] = useState(null);
  const [prevY, setPrevY] = useState(null);
  const [color, setColor] = useState('black');
  const { ws, user, game, error, loading } = useContext(CommonContext);

  // Refs for listeners
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

  useLayoutEffect(() => {
    const can = document.getElementById('drawboard') as HTMLCanvasElement;
    const con = can.getContext('2d');

    setCanvas(can);
    con.fillStyle = '#FFFFFF';
    con.fillRect(0, 0, width, height);
    con.lineWidth = 20;
    con.strokeStyle = color;
    con.lineCap = 'round';
    setCtx(con);

    setBoundings(can.getBoundingClientRect());

    const handleMouseDown = (event) => {
      const [x, y] = getXY(event);
      setIsDrawing(true);

      // Draw initial dot
      drawBrush(ctxRef.current, x, y, prevX, prevY);

      setPrevX(x);
      setPrevY(y);
    };

    const handleMouseMove = (event) => {
      const [x, y] = getXY(event);

      if (isDrawingRef.current) {
        drawBrush(ctxRef.current, x, y, prevXRef.current, prevYRef.current);

        setPrevX(x);
        setPrevY(y);
      }
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
      setPrevX(null);
      setPrevY(null);
    };

    can.addEventListener('mousedown', handleMouseDown);
    can.addEventListener('mousemove', handleMouseMove);
    can.addEventListener('mouseup', handleMouseUp);

    return () => {
      can.removeEventListener('mousedown', handleMouseDown);
      can.removeEventListener('mousemove', handleMouseMove);
      can.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  //   clearButton.addEventListener('click', function() {
  //     context.clearRect(0, 0, canvas.width, canvas.height);
  //   });

  const handleSubmit = () => {
    const data = canvas.toDataURL();
    ws.send(
      JSON.stringify({
        type: 'submit-drawing',
        payload: { user, game: game.code, data },
      } as Message)
    );
  };

  useEffect(() => {
    if (ctxRef.current) ctxRef.current.strokeStyle = color;
  }, [color]);

  return (
    <Wrapper>
      <Controls setColor={setColor} />
      <Canvas id="drawboard" width={width} height={height} />
      <a onClick={handleSubmit}>Submit</a>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 0 auto;
  width: ${width}px;
`;

const Canvas = styled.canvas`
  // cursor: url(./myCursor.cur), none;
`;

export default Drawboard;
