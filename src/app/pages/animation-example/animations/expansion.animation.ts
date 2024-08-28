import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export default trigger('expandCollapse', [
  state(
    'collapsed',
    style({
      maxHeight: 'auto',
      overflow: 'hidden',
    })
  ),
  state(
    'expanded',
    style({
      maxHeight: '100vh',
    })
  ),
  transition('collapsed <=> expanded', [animate('0.5s ease-in-out')]),
]);
