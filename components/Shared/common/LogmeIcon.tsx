import React from 'react';
import LogmeLogoSvg from '/public/assets/logmelogo.svg';
import LogoPng from '/public/assets/logo.png';
import SymbolLogoSvg from '/public/assets/symbol-logo.svg';
import Image from 'next/image';
import LogmeNewNavLogo from 'public/assets/NavLogo.svg';

interface IconProps {
  width: number;
  height: number;
  alt: string;
  cn?: string;
  onClick?: () => void;
}

export const LogmeLogoIcon = (props: IconProps) => (
  <Image
    src={LogmeLogoSvg}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const LogoIcon = (props: IconProps) => (
  <Image
    src={LogoPng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);

export const SymbolLogoIcon = (props: IconProps) => (
  <Image
    src={SymbolLogoSvg}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);

export const NavLogo = (props: IconProps) => (
  <Image
    src={LogmeNewNavLogo}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
