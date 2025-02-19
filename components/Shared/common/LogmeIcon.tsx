import React from 'react';
import AddPng from '/public/assets/add.png';
import LikePng from '/public/assets/like.png';
import DisLikePng from '/public/assets/disLike.png';
import ArrowSvg from '/public/assets/Arrow.svg';
import ClosePng from '/public/assets/close.png';
import EyePng from '/public/assets/eye.png';
import GithubSvg from '/public/assets/github.svg';
import GooglePng from '/public/assets/google.png';
import KakaoSvg from '/public/assets/kakao.svg';
import LensPng from '/public/assets/lens.png';
import NaverSvg from '/public/assets/naver.svg';
import LogmeLogoSvg from '/public/assets/logmelogo.svg';
import LogoPng from '/public/assets/logo.png';
import MaginifyingGlassPng from '/public/assets/magnifying-glass.png';
import MinusPng from '/public/assets/minus.png';
import MirrorPng from '/public/assets/mirror.png';
import MorePng from '/public/assets/more.png';
import NotificationSvg from '/public/assets/notification.svg';
import SettingsSvg from '/public/assets/settings.svg';
import SymbolLogoSvg from '/public/assets/symbol-logo.svg';
import BurgerSvg from '/public/assets/burger.svg';
import Image from 'next/image';
import LogmeNewLogoSvg from 'public/assets/LogmeNewLogo.svg';
import LogmeNewNavLogo from 'public/assets/NavLogo.svg';
import LogoRec from 'public/assets/LogoRec.svg';

interface IconProps {
  width: number;
  height: number;
  alt: string;
  cn?: string;
  onClick?: () => void;
}

export const AddIcon = (props: IconProps) => (
  <Image
    src={AddPng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const ArrowIcon = (props: IconProps) => (
  <Image
    src={ArrowSvg}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const CloseIcon = (props: IconProps) => (
  <Image
    src={ClosePng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const EyeIcon = (props: IconProps) => (
  <Image
    src={EyePng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const GithubIcon = (props: IconProps) => (
  <Image
    src={GithubSvg}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const GoogleIcon = (props: IconProps) => (
  <Image
    src={GooglePng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const KakaoIcon = (props: IconProps) => (
  <Image
    src={KakaoSvg}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const LensIcon = (props: IconProps) => (
  <Image
    src={LensPng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const NaverIcon = (props: IconProps) => (
  <Image
    src={NaverSvg}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
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
export const MaginifyingGlassIcon = (props: IconProps) => (
  <Image
    src={MaginifyingGlassPng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const MinusIcon = (props: IconProps) => (
  <Image
    src={MinusPng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const MirrorIcon = (props: IconProps) => (
  <Image
    src={MirrorPng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const MoreIcon = (props: IconProps) => (
  <Image
    src={MorePng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const NotificationIcon = (props: IconProps) => (
  <Image
    src={NotificationSvg}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const SettingsIcon = (props: IconProps) => (
  <Image
    src={SettingsSvg}
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

export const BurgerIcon = (props: IconProps) => (
  <Image
    src={BurgerSvg}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
export const NewLogo = (props: IconProps) => (
  <Image
    src={LogmeNewLogoSvg}
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
export const LogoRectangle = (props: IconProps) => (
  <Image
    src={LogoRec}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);

export const LikeIcon = (props: IconProps) => (
  <Image
    src={LikePng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);

export const DisLikeIcon = (props: IconProps) => (
  <Image
    src={DisLikePng}
    alt={props.alt}
    width={props.width}
    height={props.height}
    className={props.cn}
  />
);
