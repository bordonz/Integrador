const posiciones = {};

function siguiente(pubId) {
  const track = document.querySelector(`.carousel-track[data-pub-id="${pubId}"]`);
  const items = track.querySelectorAll('.carousel-item');
  let pos = posiciones[pubId] || 0;

  pos = (pos + 1) % items.length;
  posiciones[pubId] = pos;

  track.style.transform = `translateX(-${pos * 220}px)`;
}

function anterior(pubId) {
  const track = document.querySelector(`.carousel-track[data-pub-id="${pubId}"]`);
  const items = track.querySelectorAll('.carousel-item');
  let pos = posiciones[pubId] || 0;

  pos = (pos - 1 + items.length) % items.length;
  posiciones[pubId] = pos;

  track.style.transform = `translateX(-${pos * 220}px)`;
}
