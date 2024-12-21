import React, {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  useState,
  useRef,
} from "react";
import styled, { css } from "styled-components";

type NeonButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  blurAmount?: number;
  beforeBlur?: number;
  afterBlur?: number;
  color?: string;
} & (
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
);

// Color manipulation helpers
const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace("#", "");
  const num = parseInt(hex, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.min(Math.max(0, r), 255);
  g = Math.min(Math.max(0, g), 255);
  b = Math.min(Math.max(0, b), 255);

  return `#${(b | (g << 8) | (r << 16)).toString(16).padStart(6, "0")}`;
};

const lightenColor = (color: string, percent: number): string => {
  const amount = Math.floor((255 * percent) / 100);
  return adjustColor(color, amount);
};

const darkenColor = (color: string, percent: number): string => {
  const amount = Math.floor((-255 * percent) / 100);
  return adjustColor(color, amount);
};

const colorWithOpacity = (color: string, opacity: number): string => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const DEFAULT_COLOR = "#ffaa81";
const DEFAULT_BLUR = 3;
const DEFAULT_BEFORE_BLUR = 1;
const DEFAULT_AFTER_BLUR = 5;

const BorderButtonLightBlur = styled.div<{
  $opacity: number;
  $blurAmount?: number;
  $beforeBlur?: number;
  $afterBlur?: number;
  $themeColor: string;
}>`
  background: rgba(255, 255, 255, 0.1);
  border-width: 2px;
  border-color: transparent;
  filter: blur(${(props) => props.$blurAmount || 7}px);
  position: absolute;
  left: 50%;
  top: 50%;
  height: calc(100% + 9px);
  width: calc(100% + 9px);
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  will-change: transform;
  opacity: ${(props) => props.$opacity};

  &::before {
    content: "";
    position: absolute;
    left: -0.125rem;
    top: -0.125rem;
    z-index: 30;
    box-sizing: content-box;
    height: 100%;
    width: 100%;
    border-radius: 9999px;
    border-width: 2px;
    border-color: transparent;
    filter: blur(${(props) => props.$beforeBlur || 2}px);
    background: linear-gradient(transparent, transparent) padding-box,
      linear-gradient(
          97.68deg,
          ${(props) => colorWithOpacity(props.$themeColor, 0)} 38.1%,
          ${(props) => colorWithOpacity(props.$themeColor, 0.2)} 82.47%,
          ${(props) => props.$themeColor} 93.3%
        )
        border-box;
  }

  &::after {
    content: "";
    position: absolute;
    left: -3px;
    top: -3px;
    z-index: 20;
    box-sizing: content-box;
    height: 100%;
    width: 100%;
    border-radius: 9999px;
    border-width: 3px;
    border-color: transparent;
    filter: blur(${(props) => props.$afterBlur || 15}px);
    background: linear-gradient(transparent, transparent) padding-box,
      linear-gradient(
          91.88deg,
          ${(props) => colorWithOpacity(props.$themeColor, 0.2)} 46.45%,
          ${(props) => darkenColor(props.$themeColor, 20)} 98.59%
        )
        border-box;
  }
`;

const BorderButtonLight = styled.div`
  position: absolute;
  left: -0.125rem;
  top: -0.125rem;
  z-index: 10;
  height: 100%;
  width: 100%;
  border-radius: 9999px;
  border-width: 2px;
  border-color: transparent;

  &::before {
    content: "";
    position: absolute;
    left: -0.125rem;
    top: -0.125rem;
    z-index: 30;
    box-sizing: content-box;
    height: 100%;
    width: 100%;
    border-radius: 9999px;
    border-width: 2px;
    border-color: transparent;
    filter: blur(7px);
    background: linear-gradient(transparent, transparent) padding-box,
      linear-gradient(
          91.96deg,
          rgba(255, 177, 153, 0) 6.11%,
          rgba(255, 177, 153, 0.2) 53.57%,
          #ff7950 93.6%
        )
        border-box;
  }
`;

const GradientContainer = styled.div<{ $mouseX: number }>`
  position: absolute;
  z-index: -1;
  display: flex;
  width: 100%;
  items-align: center;
  justify-content: center;
  transform: translateX(${(props) => props.$mouseX}px);
  pointer-events: none;
`;

const PrimaryGlow = styled.div<{ $themeColor: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  height: 121px;
  width: 121px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    50% 50% at 50% 50%,
    ${(props) => lightenColor(props.$themeColor, 95)} 3.5%,
    ${(props) => lightenColor(props.$themeColor, 20)} 26.5%,
    ${(props) => lightenColor(props.$themeColor, 40)} 37.5%,
    ${(props) => colorWithOpacity(props.$themeColor, 0.5)} 49%,
    ${(props) => colorWithOpacity(darkenColor(props.$themeColor, 20), 0)} 92.5%
  );
`;

const BlurGradient = styled.div<{ $themeColor: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  height: 103px;
  width: 204px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    43.3% 44.23% at 50% 49.51%,
    ${(props) => lightenColor(props.$themeColor, 95)} 29%,
    ${(props) => lightenColor(props.$themeColor, 60)} 48.5%,
    ${(props) => lightenColor(props.$themeColor, 30)} 60.71%,
    ${(props) => colorWithOpacity(props.$themeColor, 0)} 100%
  );
  filter: blur(5px);
`;

const ButtonContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  z-index: 10;
`;

const baseButtonStyles = css`
  transition: all 200ms;
  text-transform: uppercase;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0;
  font-size: 12px;
  color: black;
  letter-spacing: -0.015em;
  position: relative;
  z-index: 10;
  overflow: hidden;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background-color: #d1d1d1;
  width: 174px;
`;

const StyledButton = styled.button`
  ${baseButtonStyles}
`;

const StyledAnchor = styled.a`
  ${baseButtonStyles}
`;

const ButtonText = styled.span<{ $themeColor: string }>`
  color: ${(props) => darkenColor(props.$themeColor, 40)};
`;

const NeonButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  NeonButtonProps
>(
  (
    {
      children,
      href,
      className = "",
      blurAmount = DEFAULT_BLUR,
      beforeBlur = DEFAULT_BEFORE_BLUR,
      afterBlur = DEFAULT_AFTER_BLUR,
      color = DEFAULT_COLOR,
      ...props
    },
    forwardedRef
  ) => {
    const [mouseX, setMouseX] = useState(81);
    const [leftOpacity, setLeftOpacity] = useState(0);
    const [rightOpacity, setRightOpacity] = useState(0);
    const internalRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

    const buttonRef = (forwardedRef || internalRef) as React.RefObject<
      HTMLButtonElement | HTMLAnchorElement
    >;

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2; // Center the calculation

      const leftEdgeDistance = x + rect.width / 2; // Adjust for centering
      const rightEdgeDistance = rect.width - leftEdgeDistance;
      const threshold = rect.width / 2;

      const leftGlowOpacity = Math.max(
        0,
        Math.min(1, 1 - leftEdgeDistance / threshold)
      );
      const rightGlowOpacity = Math.max(
        0,
        Math.min(1, 1 - rightEdgeDistance / threshold)
      );

      setMouseX(x);
      setLeftOpacity(leftGlowOpacity);
      setRightOpacity(rightGlowOpacity);
    };

    const handleMouseLeave = () => {
      setLeftOpacity(0);
      setRightOpacity(0);
    };

    return (
      <ButtonContainer>
        <BorderButtonLightBlur
          $opacity={rightOpacity}
          $blurAmount={blurAmount}
          $beforeBlur={beforeBlur}
          $afterBlur={afterBlur}
          $themeColor={color}
        >
          <BorderButtonLight />
        </BorderButtonLightBlur>
        <BorderButtonLightBlur
          $opacity={leftOpacity}
          $blurAmount={blurAmount}
          $beforeBlur={beforeBlur}
          $afterBlur={afterBlur}
          $themeColor={color}
          style={{ transform: "translate(-50%, -50%) scaleX(-1)" }}
        >
          <BorderButtonLight />
        </BorderButtonLightBlur>

        {href ? (
          <StyledAnchor
            {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
            ref={buttonRef as React.Ref<HTMLAnchorElement>}
            href={href}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <GradientContainer $mouseX={mouseX}>
              <PrimaryGlow $themeColor={color} />
              <BlurGradient $themeColor={color} />
            </GradientContainer>
            <ButtonText $themeColor={color}>{children}</ButtonText>
          </StyledAnchor>
        ) : (
          <StyledButton
            {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
            ref={buttonRef as React.Ref<HTMLButtonElement>}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <GradientContainer $mouseX={mouseX}>
              <PrimaryGlow $themeColor={color} />
              <BlurGradient $themeColor={color} />
            </GradientContainer>
            <ButtonText $themeColor={color}>{children}</ButtonText>
          </StyledButton>
        )}
      </ButtonContainer>
    );
  }
);

NeonButton.displayName = "NeonButton";

export default NeonButton;
