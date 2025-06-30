import { trigger, style, animate, transition, query, group } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('* => slideLeft', slideTo('right')),
  transition('* => slideRight', slideTo('left')),
]);

function slideTo(direction: 'left' | 'right') {
  const x = direction === 'left' ? '-100%' : '100%';
  return [
    query(':enter, :leave', style({ position: 'fixed', width: '100%',  height:'100%'}), { optional: true }),
    group([
      query(':enter', [
        style({ transform: `translateX(${x})` }),
        animate('1000ms ease-in', style({ transform: 'translateX(0%)' })),
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('1000ms ease-in', style({ transform: `translateX(${-x})` })),
      ], { optional: true }),
    ]),
  ];
}
