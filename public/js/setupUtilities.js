'use strict';

addEventListener('load', function load(event) {
  // Activate bg animations.
  document.body.classList.add('anim-active');

  // Show pause button.
  var animButton = document.getElementById('anim-button');
  animButton.style.display = 'inline-block';
  animButton.removeAttribute('aria-hidden');
  animButton.setAttribute('tabindex', '0');

  // Toggle pause button.
  var toggleAnimButton = function(e) {
    if (e.target === animButton) {
      // Toggle text: Play/Pause.
      animButton.innerText = animButton.innerText.indexOf('Pause') == -1
        ? 'Pause animations'
        : 'Play animations';

      // Toggle body class that adds animations.
      document.body.classList.contains('anim-active') == -1
        ? document.body.classList.add('anim-active')
        : document.body.classList.remove('anim-active');
    }
  };

  addEventListener('click', toggleAnimButton);
});
