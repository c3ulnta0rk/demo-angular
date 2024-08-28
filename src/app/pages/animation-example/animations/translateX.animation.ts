import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export default trigger('translateX', [
  state(
    'initial',
    style({
      // styles initiaux
      transform: 'translateX(0)',
    })
  ),
  state(
    'changed',
    style({
      // styles après le changement
      transform: 'translateX(100px)',
    })
  ),
  transition('initial => changed', [animate('0.5s ease-in')]),
  transition('changed => initial', [animate('0.5s ease-out')]),
]);
