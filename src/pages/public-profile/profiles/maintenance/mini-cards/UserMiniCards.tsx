import { CardProps } from '@mui/material';
import React, { Fragment } from 'react';
interface IMetricCard {
  value: string | number;
  label: string;
  color: string;
  iconColor?: string;
  bgColor?: string;
  icon?: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children, className}) => (
  <div className={`card ${className}`}>{children}</div>
);

const UserMiniCards = () => {
  const metrics: IMetricCard[] = [
    {
      value: '250',
      label: 'Total Vehicles',
      color: 'text-white',
      bgColor: 'bg-blue-500',
      icon: `
        <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_688_15059)">
<g clip-path="url(#clip1_688_15059)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.6967 7.86025L11.2641 14.0516C11.234 14.0806 11.2553 14.13 11.2979 14.1299C13.0931 14.1267 14.0831 14.1256 14.8823 14.3681C14.8997 14.3733 14.9174 14.3692 14.9303 14.3568L19.6884 9.7772C19.9302 9.54446 20.2425 9.4383 20.5886 9.47994L22.4186 9.7C22.7614 9.7412 23.0744 9.63787 23.3187 9.40269L24.5739 8.19453C24.7955 7.98115 24.9028 7.71713 24.8903 7.41559L24.7908 5.03349C24.7891 4.99353 24.7389 4.97467 24.7096 5.00291C23.9341 5.74927 23.1586 6.49569 22.3832 7.24205C22.1421 7.47409 21.7489 7.47403 21.5079 7.24205L20.3308 6.10909C20.0897 5.87706 20.0897 5.49864 20.3308 5.26661C21.1063 4.52025 21.8818 3.77383 22.6573 3.02742C22.6867 2.99912 22.667 2.95081 22.6255 2.94924L20.1506 2.8535C19.8373 2.84135 19.5629 2.94463 19.3412 3.15796L18.0859 4.36617C17.8416 4.6013 17.7342 4.90256 17.777 5.23245L18.0057 6.9938C18.0488 7.32695 17.9385 7.62756 17.6967 7.86025ZM19.2253 20.3237C18.7023 20.5308 18.2959 20.9999 18.2959 21.7329C18.2959 22.5961 19.0228 23.2957 19.9195 23.2957C20.8164 23.2957 21.5432 22.5961 21.5432 21.7329C21.5432 20.9846 21.1311 20.5308 20.5974 20.3173L20.5972 20.3178C20.1483 20.1451 19.6769 20.1617 19.2268 20.3232C19.2263 20.3234 19.2258 20.3235 19.2253 20.3237ZM9.19514 20.6278C8.56113 20.0176 7.53289 20.0176 6.89888 20.6278C6.26486 21.238 6.26486 22.2277 6.89888 22.8379C7.53294 23.4482 8.56113 23.4482 9.19514 22.8379C9.82915 22.2277 9.82915 21.238 9.19514 20.6278ZM16.9601 16.5868C17.399 16.9585 18.5485 17.3726 19.0647 17.512C20.5858 17.923 22.2812 18.244 23.7825 18.5701C24.4627 18.7178 25.0543 19.1446 25.163 19.8C25.2317 20.2144 25.1862 20.7271 25.1642 21.2082C25.1593 21.3145 25.062 21.389 24.948 21.389H22.2767C22.2529 21.389 22.233 21.3725 22.2296 21.3498C22.1014 20.502 21.5474 19.9455 20.8622 19.6816L20.8624 19.6811C19.526 19.167 17.8427 19.8148 17.6096 21.3498C17.6062 21.3724 17.5863 21.389 17.5625 21.389H10.3984C10.3751 21.389 10.3555 21.3731 10.3515 21.3509C10.2683 20.8825 10.0347 20.4635 9.70022 20.1416C8.42087 18.9102 6.25056 19.4938 5.78941 21.1451C5.78288 21.1685 5.7586 21.183 5.73387 21.1781L3.48144 20.7327C3.26762 20.6904 3.05273 20.5516 3.05273 20.3389V17.7173C3.05273 17.3525 3.38698 17.1058 3.75828 17.0267L5.9754 16.5544C6.04987 16.5386 6.11965 16.4998 6.17215 16.439C7.57451 14.8134 7.77436 14.8135 10.5769 14.8151C10.7937 14.8152 11.0253 14.8153 11.2731 14.8148C13.0885 14.8108 14.004 14.8134 14.6981 15.032C15.3721 15.2443 15.9068 15.6949 16.9601 16.5868ZM20.0777 10.3878C20.0705 10.3705 20.0743 10.352 20.0878 10.3387C20.2082 10.2203 20.2966 10.1191 20.5023 10.1438L22.3323 10.3639C22.8326 10.4241 23.3148 10.2862 23.694 9.97855C23.7207 9.95681 23.7616 9.96917 23.7706 10.0017L24.3186 11.9699C24.324 11.9894 24.3161 12.0092 24.2985 12.0202L22.6946 13.0228C22.6821 13.0306 22.6746 13.0423 22.6731 13.0566C22.5897 13.8562 22.3704 14.6301 22.0328 15.3498C22.0267 15.3629 22.027 15.3766 22.0338 15.3895L22.9033 17.0319C22.9128 17.0499 22.9093 17.0708 22.8945 17.0852L22.4061 17.5553C22.3943 17.5667 22.3786 17.5711 22.3623 17.5677C21.3137 17.3481 20.2635 17.1233 19.2573 16.8513C19.0298 16.7899 18.687 16.6752 18.3478 16.5394C18.3138 16.5258 18.308 16.4822 18.3372 16.4607C20.3038 15.0127 20.9612 12.5171 20.0777 10.3878ZM11.2273 8.63947C9.70174 10.1078 9.27771 12.235 9.95521 14.0695C9.9663 14.0995 9.94349 14.1306 9.91048 14.1307C8.00152 14.1374 7.37776 14.2168 6.51811 15.033C6.49209 15.0577 6.44815 15.0463 6.43869 15.0122L5.78755 12.6732C5.78215 12.6537 5.79003 12.6339 5.80761 12.6229L7.41156 11.6204C7.42406 11.6125 7.4315 11.6008 7.43302 11.5866C7.51644 10.7869 7.73572 10.0131 8.07328 9.29339C8.07942 9.28027 8.07908 9.26656 8.07232 9.25371L7.20287 7.6113C7.19335 7.5933 7.19679 7.57238 7.2116 7.55812L10.104 4.77429C10.1188 4.76003 10.1406 4.75667 10.1592 4.76584L11.8641 5.60192C11.8773 5.60843 11.8916 5.60881 11.9052 5.6029C12.6599 5.27642 13.4656 5.06856 14.2889 4.98817C14.3037 4.9867 14.3158 4.9796 14.324 4.96751L15.3662 3.42296C15.3776 3.40605 15.3981 3.3984 15.4184 3.40366L17.4634 3.93105C17.4972 3.93978 17.51 3.97914 17.4875 4.00489C17.1678 4.3698 17.0246 4.83398 17.087 5.31545L17.3157 7.07691C17.3414 7.2748 17.2362 7.35991 17.1133 7.47577C17.0995 7.48872 17.0802 7.49241 17.0623 7.48552C15.114 6.73667 12.8048 7.1211 11.2273 8.63947Z" fill="#5271FF"/>
</g>
</g>
<defs>
<clipPath id="clip0_688_15059">
<rect x="0.200195" width="27" height="27" rx="5" fill="white"/>
</clipPath>
<clipPath id="clip1_688_15059">
<rect width="24.7021" height="24.7021" fill="white" transform="translate(1.34912 1.14844)"/>
</clipPath>
</defs>
</svg>

      `
    },
    {
      value: '5',
      label: 'Rented Vehicles',
      color: 'text-gray-900',
      icon: `
<svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_688_15066)">
<g clip-path="url(#clip1_688_15066)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.8964 7.86025L11.4638 14.0516C11.4337 14.0806 11.455 14.13 11.4976 14.1299C13.2928 14.1267 14.2829 14.1256 15.082 14.3681C15.0994 14.3733 15.1171 14.3692 15.13 14.3568L19.8881 9.7772C20.1299 9.54446 20.4422 9.4383 20.7883 9.47994L22.6183 9.7C22.9611 9.7412 23.2741 9.63787 23.5184 9.40269L24.7736 8.19453C24.9952 7.98115 25.1026 7.71713 25.09 7.41559L24.9905 5.03349C24.9888 4.99353 24.9386 4.97467 24.9093 5.00291C24.1338 5.74927 23.3583 6.49569 22.5829 7.24205C22.3418 7.47409 21.9486 7.47403 21.7076 7.24205L20.5305 6.10909C20.2895 5.87706 20.2895 5.49864 20.5305 5.26661C21.306 4.52025 22.0815 3.77383 22.857 3.02742C22.8864 2.99912 22.8667 2.95081 22.8252 2.94924L20.3503 2.8535C20.037 2.84135 19.7626 2.94463 19.5409 3.15796L18.2856 4.36617C18.0414 4.6013 17.9339 4.90256 17.9767 5.23245L18.2054 6.9938C18.2485 7.32695 18.1382 7.62756 17.8964 7.86025ZM19.425 20.3237C18.902 20.5308 18.4956 20.9999 18.4956 21.7329C18.4956 22.5961 19.2225 23.2957 20.1192 23.2957C21.0161 23.2957 21.7429 22.5961 21.7429 21.7329C21.7429 20.9846 21.3308 20.5308 20.7971 20.3173L20.7969 20.3178C20.348 20.1451 19.8766 20.1617 19.4265 20.3232C19.426 20.3234 19.4255 20.3235 19.425 20.3237ZM9.39484 20.6278C8.76083 20.0176 7.73259 20.0176 7.09858 20.6278C6.46457 21.238 6.46457 22.2277 7.09858 22.8379C7.73265 23.4482 8.76083 23.4482 9.39484 22.8379C10.0289 22.2277 10.0289 21.238 9.39484 20.6278ZM17.1598 16.5868C17.5987 16.9585 18.7482 17.3726 19.2644 17.512C20.7855 17.923 22.4809 18.244 23.9822 18.5701C24.6624 18.7178 25.254 19.1446 25.3627 19.8C25.4314 20.2144 25.3859 20.7271 25.3639 21.2082C25.359 21.3145 25.2617 21.389 25.1477 21.389H22.4764C22.4526 21.389 22.4327 21.3725 22.4294 21.3498C22.3011 20.502 21.7471 19.9455 21.0619 19.6816L21.0621 19.6811C19.7257 19.167 18.0424 19.8148 17.8093 21.3498C17.8059 21.3724 17.786 21.389 17.7623 21.389H10.5981C10.5748 21.389 10.5552 21.3731 10.5512 21.3509C10.468 20.8825 10.2344 20.4635 9.89992 20.1416C8.62058 18.9102 6.45026 19.4938 5.98912 21.1451C5.98259 21.1685 5.95831 21.183 5.93358 21.1781L3.68114 20.7327C3.46733 20.6904 3.25244 20.5516 3.25244 20.3389V17.7173C3.25244 17.3525 3.58668 17.1058 3.95799 17.0267L6.17511 16.5544C6.24957 16.5386 6.31936 16.4998 6.37186 16.439C7.77422 14.8134 7.97406 14.8135 10.7766 14.8151C10.9934 14.8152 11.225 14.8153 11.4728 14.8148C13.2882 14.8108 14.2037 14.8134 14.8978 15.032C15.5718 15.2443 16.1065 15.6949 17.1598 16.5868ZM20.2774 10.3878C20.2702 10.3705 20.274 10.352 20.2875 10.3387C20.4079 10.2203 20.4963 10.1191 20.702 10.1438L22.532 10.3639C23.0323 10.4241 23.5145 10.2862 23.8937 9.97855C23.9204 9.95681 23.9613 9.96917 23.9703 10.0017L24.5183 11.9699C24.5237 11.9894 24.5158 12.0092 24.4982 12.0202L22.8943 13.0228C22.8818 13.0306 22.8743 13.0423 22.8728 13.0566C22.7894 13.8562 22.5701 14.6301 22.2325 15.3498C22.2264 15.3629 22.2267 15.3766 22.2335 15.3895L23.103 17.0319C23.1125 17.0499 23.109 17.0708 23.0942 17.0852L22.6058 17.5553C22.594 17.5667 22.5783 17.5711 22.562 17.5677C21.5134 17.3481 20.4632 17.1233 19.457 16.8513C19.2295 16.7899 18.8867 16.6752 18.5475 16.5394C18.5135 16.5258 18.5077 16.4822 18.5369 16.4607C20.5035 15.0127 21.1609 12.5171 20.2774 10.3878ZM11.427 8.63947C9.90144 10.1078 9.47742 12.235 10.1549 14.0695C10.166 14.0995 10.1432 14.1306 10.1102 14.1307C8.20123 14.1374 7.57747 14.2168 6.71782 15.033C6.69179 15.0577 6.64786 15.0463 6.63839 15.0122L5.98726 12.6732C5.98185 12.6537 5.98974 12.6339 6.00731 12.6229L7.61127 11.6204C7.62377 11.6125 7.63121 11.6008 7.63273 11.5866C7.71615 10.7869 7.93542 10.0131 8.27299 9.29339C8.27913 9.28027 8.27879 9.26656 8.27203 9.25371L7.40258 7.6113C7.39306 7.5933 7.39649 7.57238 7.41131 7.55812L10.3037 4.77429C10.3185 4.76003 10.3403 4.75667 10.3589 4.76584L12.0638 5.60192C12.0771 5.60843 12.0913 5.60881 12.1049 5.6029C12.8597 5.27642 13.6653 5.06856 14.4886 4.98817C14.5034 4.9867 14.5155 4.9796 14.5237 4.96751L15.5659 3.42296C15.5773 3.40605 15.5979 3.3984 15.6181 3.40366L17.6631 3.93105C17.6969 3.93978 17.7098 3.97914 17.6872 4.00489C17.3675 4.3698 17.2243 4.83398 17.2867 5.31545L17.5154 7.07691C17.5411 7.2748 17.436 7.35991 17.313 7.47577C17.2992 7.48872 17.2799 7.49241 17.262 7.48552C15.3137 6.73667 13.0045 7.1211 11.427 8.63947Z" fill="#1BC5BD"/>
</g>
</g>
<defs>
<clipPath id="clip0_688_15066">
<rect x="0.399902" width="27" height="27" rx="5" fill="white"/>
</clipPath>
<clipPath id="clip1_688_15066">
<rect width="24.7021" height="24.7021" fill="white" transform="translate(1.54883 1.14844)"/>
</clipPath>
</defs>
</svg>

`
    },
    {
      value: '25',
      label: 'Vehicles in maintenance',
      color: 'text-gray-900',
      icon: `<svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_688_15082)">
<g clip-path="url(#clip1_688_15082)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.0966 7.86025L11.664 14.0516C11.6339 14.0806 11.6552 14.13 11.6978 14.1299C13.493 14.1267 14.483 14.1256 15.2822 14.3681C15.2996 14.3733 15.3173 14.3692 15.3302 14.3568L20.0883 9.7772C20.3301 9.54446 20.6424 9.4383 20.9885 9.47994L22.8185 9.7C23.1613 9.7412 23.4743 9.63787 23.7186 9.40269L24.9738 8.19453C25.1954 7.98115 25.3027 7.71713 25.2902 7.41559L25.1907 5.03349C25.189 4.99353 25.1388 4.97467 25.1095 5.00291C24.334 5.74927 23.5585 6.49569 22.7831 7.24205C22.542 7.47409 22.1488 7.47403 21.9078 7.24205L20.7307 6.10909C20.4896 5.87706 20.4896 5.49864 20.7307 5.26661C21.5062 4.52025 22.2817 3.77383 23.0572 3.02742C23.0866 2.99912 23.0669 2.95081 23.0254 2.94924L20.5505 2.8535C20.2372 2.84135 19.9628 2.94463 19.7411 3.15796L18.4858 4.36617C18.2415 4.6013 18.1341 4.90256 18.1769 5.23245L18.4056 6.9938C18.4487 7.32695 18.3384 7.62756 18.0966 7.86025ZM19.6252 20.3237C19.1022 20.5308 18.6958 20.9999 18.6958 21.7329C18.6958 22.5961 19.4227 23.2957 20.3194 23.2957C21.2163 23.2957 21.9431 22.5961 21.9431 21.7329C21.9431 20.9846 21.531 20.5308 20.9973 20.3173L20.9971 20.3178C20.5482 20.1451 20.0768 20.1617 19.6267 20.3232C19.6262 20.3234 19.6257 20.3235 19.6252 20.3237ZM9.59504 20.6278C8.96103 20.0176 7.93279 20.0176 7.29878 20.6278C6.66477 21.238 6.66477 22.2277 7.29878 22.8379C7.93284 23.4482 8.96103 23.4482 9.59504 22.8379C10.229 22.2277 10.229 21.238 9.59504 20.6278ZM17.36 16.5868C17.7989 16.9585 18.9484 17.3726 19.4646 17.512C20.9857 17.923 22.6811 18.244 24.1824 18.5701C24.8626 18.7178 25.4542 19.1446 25.5629 19.8C25.6316 20.2144 25.5861 20.7271 25.5641 21.2082C25.5592 21.3145 25.4619 21.389 25.3479 21.389H22.6766C22.6528 21.389 22.6329 21.3725 22.6295 21.3498C22.5013 20.502 21.9473 19.9455 21.2621 19.6816L21.2623 19.6811C19.9259 19.167 18.2426 19.8148 18.0095 21.3498C18.0061 21.3724 17.9862 21.389 17.9624 21.389H10.7983C10.775 21.389 10.7554 21.3731 10.7514 21.3509C10.6682 20.8825 10.4346 20.4635 10.1001 20.1416C8.82078 18.9102 6.65046 19.4938 6.18931 21.1451C6.18278 21.1685 6.1585 21.183 6.13378 21.1781L3.88134 20.7327C3.66752 20.6904 3.45264 20.5516 3.45264 20.3389V17.7173C3.45264 17.3525 3.78688 17.1058 4.15818 17.0267L6.3753 16.5544C6.44977 16.5386 6.51956 16.4998 6.57205 16.439C7.97441 14.8134 8.17426 14.8135 10.9768 14.8151C11.1936 14.8152 11.4252 14.8153 11.673 14.8148C13.4884 14.8108 14.4039 14.8134 15.098 15.032C15.772 15.2443 16.3067 15.6949 17.36 16.5868ZM20.4776 10.3878C20.4704 10.3705 20.4742 10.352 20.4877 10.3387C20.6081 10.2203 20.6965 10.1191 20.9022 10.1438L22.7322 10.3639C23.2325 10.4241 23.7147 10.2862 24.0939 9.97855C24.1206 9.95681 24.1615 9.96917 24.1705 10.0017L24.7185 11.9699C24.7239 11.9894 24.716 12.0092 24.6984 12.0202L23.0945 13.0228C23.082 13.0306 23.0745 13.0423 23.073 13.0566C22.9896 13.8562 22.7703 14.6301 22.4327 15.3498C22.4266 15.3629 22.4269 15.3766 22.4337 15.3895L23.3032 17.0319C23.3127 17.0499 23.3092 17.0708 23.2944 17.0852L22.806 17.5553C22.7942 17.5667 22.7785 17.5711 22.7622 17.5677C21.7136 17.3481 20.6634 17.1233 19.6572 16.8513C19.4297 16.7899 19.0869 16.6752 18.7477 16.5394C18.7137 16.5258 18.7079 16.4822 18.7371 16.4607C20.7037 15.0127 21.3611 12.5171 20.4776 10.3878ZM11.6272 8.63947C10.1016 10.1078 9.67761 12.235 10.3551 14.0695C10.3662 14.0995 10.3434 14.1306 10.3104 14.1307C8.40142 14.1374 7.77767 14.2168 6.91801 15.033C6.89199 15.0577 6.84805 15.0463 6.83859 15.0122L6.18746 12.6732C6.18205 12.6537 6.18993 12.6339 6.20751 12.6229L7.81146 11.6204C7.82397 11.6125 7.8314 11.6008 7.83292 11.5866C7.91634 10.7869 8.13562 10.0131 8.47318 9.29339C8.47932 9.28027 8.47899 9.26656 8.47223 9.25371L7.60277 7.6113C7.59325 7.5933 7.59669 7.57238 7.6115 7.55812L10.5039 4.77429C10.5187 4.76003 10.5405 4.75667 10.5591 4.76584L12.264 5.60192C12.2772 5.60843 12.2915 5.60881 12.3051 5.6029C13.0598 5.27642 13.8655 5.06856 14.6888 4.98817C14.7036 4.9867 14.7157 4.9796 14.7239 4.96751L15.7661 3.42296C15.7775 3.40605 15.798 3.3984 15.8183 3.40366L17.8633 3.93105C17.8971 3.93978 17.91 3.97914 17.8874 4.00489C17.5677 4.3698 17.4245 4.83398 17.4869 5.31545L17.7156 7.07691C17.7413 7.2748 17.6361 7.35991 17.5132 7.47577C17.4994 7.48872 17.4801 7.49241 17.4622 7.48552C15.5139 6.73667 13.2047 7.1211 11.6272 8.63947Z" fill="#FF0000"/>
</g>
</g>
<defs>
<clipPath id="clip0_688_15082">
<rect x="0.600098" width="27" height="27" rx="5" fill="white"/>
</clipPath>
<clipPath id="clip1_688_15082">
<rect width="24.7021" height="24.7021" fill="white" transform="translate(1.74902 1.14844)"/>
</clipPath>
</defs>
</svg>




`
    },
    {
      value: '5',
      label: 'Available For Rent',
      color: 'text-gray-900',
      icon: `<svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_688_15095)">
<g clip-path="url(#clip1_688_15095)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.2963 7.86025L11.8637 14.0516C11.8336 14.0806 11.8549 14.13 11.8975 14.1299C13.6927 14.1267 14.6828 14.1256 15.4819 14.3681C15.4993 14.3733 15.517 14.3692 15.5299 14.3568L20.288 9.7772C20.5298 9.54446 20.8421 9.4383 21.1882 9.47994L23.0182 9.7C23.361 9.7412 23.674 9.63787 23.9183 9.40269L25.1735 8.19453C25.3952 7.98115 25.5025 7.71713 25.4899 7.41559L25.3904 5.03349C25.3887 4.99353 25.3385 4.97467 25.3092 5.00291C24.5337 5.74927 23.7582 6.49569 22.9828 7.24205C22.7417 7.47409 22.3485 7.47403 22.1075 7.24205L20.9304 6.10909C20.6894 5.87706 20.6894 5.49864 20.9304 5.26661C21.7059 4.52025 22.4814 3.77383 23.2569 3.02742C23.2863 2.99912 23.2666 2.95081 23.2251 2.94924L20.7502 2.8535C20.4369 2.84135 20.1625 2.94463 19.9408 3.15796L18.6855 4.36617C18.4413 4.6013 18.3338 4.90256 18.3766 5.23245L18.6053 6.9938C18.6484 7.32695 18.5381 7.62756 18.2963 7.86025ZM19.8249 20.3237C19.3019 20.5308 18.8955 20.9999 18.8955 21.7329C18.8955 22.5961 19.6224 23.2957 20.5191 23.2957C21.416 23.2957 22.1428 22.5961 22.1428 21.7329C22.1428 20.9846 21.7307 20.5308 21.197 20.3173L21.1968 20.3178C20.7479 20.1451 20.2765 20.1617 19.8264 20.3232C19.8259 20.3234 19.8254 20.3235 19.8249 20.3237ZM9.79475 20.6278C9.16074 20.0176 8.1325 20.0176 7.49848 20.6278C6.86447 21.238 6.86447 22.2277 7.49848 22.8379C8.13255 23.4482 9.16074 23.4482 9.79475 22.8379C10.4288 22.2277 10.4288 21.238 9.79475 20.6278ZM17.5597 16.5868C17.9986 16.9585 19.1481 17.3726 19.6643 17.512C21.1854 17.923 22.8808 18.244 24.3821 18.5701C25.0623 18.7178 25.6539 19.1446 25.7626 19.8C25.8313 20.2144 25.7858 20.7271 25.7638 21.2082C25.7589 21.3145 25.6616 21.389 25.5476 21.389H22.8763C22.8525 21.389 22.8326 21.3725 22.8293 21.3498C22.701 20.502 22.147 19.9455 21.4618 19.6816L21.462 19.6811C20.1256 19.167 18.4423 19.8148 18.2092 21.3498C18.2058 21.3724 18.1859 21.389 18.1622 21.389H10.998C10.9747 21.389 10.9551 21.3731 10.9511 21.3509C10.8679 20.8825 10.6343 20.4635 10.2998 20.1416C9.02048 18.9102 6.85017 19.4938 6.38902 21.1451C6.38249 21.1685 6.35821 21.183 6.33348 21.1781L4.08104 20.7327C3.86723 20.6904 3.65234 20.5516 3.65234 20.3389V17.7173C3.65234 17.3525 3.98658 17.1058 4.35789 17.0267L6.57501 16.5544C6.64948 16.5386 6.71926 16.4998 6.77176 16.439C8.17412 14.8134 8.37397 14.8135 11.1765 14.8151C11.3933 14.8152 11.6249 14.8153 11.8727 14.8148C13.6881 14.8108 14.6036 14.8134 15.2977 15.032C15.9717 15.2443 16.5064 15.6949 17.5597 16.5868ZM20.6773 10.3878C20.6701 10.3705 20.6739 10.352 20.6874 10.3387C20.8078 10.2203 20.8962 10.1191 21.1019 10.1438L22.9319 10.3639C23.4322 10.4241 23.9144 10.2862 24.2936 9.97855C24.3203 9.95681 24.3612 9.96917 24.3702 10.0017L24.9182 11.9699C24.9236 11.9894 24.9157 12.0092 24.8981 12.0202L23.2942 13.0228C23.2817 13.0306 23.2742 13.0423 23.2727 13.0566C23.1893 13.8562 22.97 14.6301 22.6325 15.3498C22.6263 15.3629 22.6266 15.3766 22.6334 15.3895L23.5029 17.0319C23.5124 17.0499 23.5089 17.0708 23.4941 17.0852L23.0057 17.5553C22.9939 17.5667 22.9782 17.5711 22.9619 17.5677C21.9133 17.3481 20.8631 17.1233 19.8569 16.8513C19.6294 16.7899 19.2866 16.6752 18.9474 16.5394C18.9134 16.5258 18.9076 16.4822 18.9368 16.4607C20.9034 15.0127 21.5608 12.5171 20.6773 10.3878ZM11.8269 8.63947C10.3013 10.1078 9.87732 12.235 10.5548 14.0695C10.5659 14.0995 10.5431 14.1306 10.5101 14.1307C8.60113 14.1374 7.97737 14.2168 7.11772 15.033C7.09169 15.0577 7.04776 15.0463 7.0383 15.0122L6.38716 12.6732C6.38176 12.6537 6.38964 12.6339 6.40722 12.6229L8.01117 11.6204C8.02367 11.6125 8.03111 11.6008 8.03263 11.5866C8.11605 10.7869 8.33533 10.0131 8.67289 9.29339C8.67903 9.28027 8.67869 9.26656 8.67193 9.25371L7.80248 7.6113C7.79296 7.5933 7.79639 7.57238 7.81121 7.55812L10.7036 4.77429C10.7184 4.76003 10.7402 4.75667 10.7588 4.76584L12.4637 5.60192C12.477 5.60843 12.4912 5.60881 12.5048 5.6029C13.2596 5.27642 14.0652 5.06856 14.8885 4.98817C14.9033 4.9867 14.9154 4.9796 14.9236 4.96751L15.9658 3.42296C15.9772 3.40605 15.9978 3.3984 16.018 3.40366L18.063 3.93105C18.0968 3.93978 18.1097 3.97914 18.0871 4.00489C17.7674 4.3698 17.6242 4.83398 17.6866 5.31545L17.9153 7.07691C17.941 7.2748 17.8359 7.35991 17.7129 7.47577C17.6992 7.48872 17.6798 7.49241 17.6619 7.48552C15.7136 6.73667 13.4044 7.1211 11.8269 8.63947Z" fill="#FFA800"/>
</g>
</g>
<defs>
<clipPath id="clip0_688_15095">
<rect x="0.799805" width="27" height="27" rx="5" fill="white"/>
</clipPath>
<clipPath id="clip1_688_15095">
<rect width="24.7021" height="24.7021" fill="white" transform="translate(1.94873 1.14844)"/>
</clipPath>
</defs>
</svg>



`
    }
  ];

  return (
    <Fragment>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ml-auto">
        New Maintenance
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className={`rounded-xl flex flex-col items-start ${metric.bgColor || 'bg-white'} ${
              index === 0 ? 'shadow-lg' : 'shadow-sm'
            }`}
          >
            <div
              className={`w-4 h-4 p-4 ${index === 0 ? 'text-white' : metric.iconColor}`}
              dangerouslySetInnerHTML={{ __html: metric.icon?.toString() || '' }}
            />
            <div className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${index === 0 ? 'text-blue-100' : 'text-gray-400'}`}>
                    {metric.label}
                  </p>
                  <p className={`text-2xl font-semibold mt-1 ${metric.color}`}>{metric.value}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Fragment>
  );
};

export { UserMiniCards };
