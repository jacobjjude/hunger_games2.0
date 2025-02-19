export function hideEvent() {
    let eventButton = document.querySelector('.new-event');
    let classList = eventButton.classList.contains('hide');

    if (classList) {
        eventButton.classList.remove('hide');
    } else {
        eventButton.classList.add('hide')
    }

    return;
}