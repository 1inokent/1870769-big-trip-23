import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { DateFormats, TRIP_EVENT_TYPE } from '../const.js';
import dayjs from 'dayjs';

const generateEventTypeItem = (type) => `
<div class="event__type-item">
  <input id="event-type-${type.toLowerCase()}-1"
  class="event__type-input  visually-hidden" type="radio" name="event-type"
  value="${type.toLowerCase()}">
  <label class="event__type-label  event__type-label--${type.toLowerCase()}"
   for="event-type-${type.toLowerCase()}-1">${type}</label>
</div>
`;

const lastWords = (offerTitle) => {
  const words = offerTitle.split(' ');
  return words[words.length - 1];
};

const generateOfferHTML = (offers) => {
  const lastWord = lastWords(offers.offerTitle);

  return `
<div class="event__offer-selector">
  <input class="event__offer-checkbox visually-hidden" id="event-offer-${lastWord}-1"
  type="checkbox" name="event-offer-${lastWord}">
  <label class="event__offer-label" for="event-offer-${lastWord}-1">
    <span class="event__offer-title">${offers.offerTitle}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offers.offerPrice}</span>
  </label>
</div>
`;
};

const createPhotoTape = (pictures) => `
    <div class="event__photos-container">
      <div class="event__photos-tape">
       <img class="event__photo" src="${pictures.src}" alt="${pictures.description}">
      </div>
    </div>`;

const createSectionDestination = ({ description, picture }) => `
 <section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${description}</p>
  ${createPhotoTape(picture)}
</section>`;

const createEditFormView = ({
  type,
  eventTitle: {destination, eventCity},
  eventDate,
  eventSchedule: {dateFrom, dateTo},
  offers,
  basePrice,
}) => {
  const { DATE_TIME } = DateFormats;
  const offersHTML = offers.map(generateOfferHTML).join('');

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${TRIP_EVENT_TYPE.map((eventType) => generateEventTypeItem(eventType, type === eventType)).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1"
           type="text" name="event-destination" value=${eventCity} list="destination-list-1">
          <datalist id="destination-list-1">
            <option value=${eventCity}></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
          value="${dayjs(eventDate).format(DATE_TIME)} ${dateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
          value="${dayjs(eventDate).format(DATE_TIME)} ${dateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text"
          name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersHTML}
        </section>

        ${createSectionDestination(destination)}
      </section>
    </form>
`;
};

export default class EditFormView extends AbstractStatefulView {
  #closeForm = null;
  #submitForm = null;

  constructor({ tripEvent, onClickCloseEditForm, onSubmitEditForm }) {
    super();
    this._setState(EditFormView.parseListElementToState(tripEvent));

    this.#closeForm = onClickCloseEditForm;
    this.#submitForm = onSubmitEditForm;

    this.#bindEventHandlers();
  }

  get template() {
    return createEditFormView(this._state);
  }

  removeElement() {
    super.removeElement();
    this.#unbindEventHandlers();
  }

  #bindEventHandlers() {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#onCloseHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#onCloseHandler);
    this.element.querySelector('.event__save-btn')
      .addEventListener('submit', this.#onSubmitHandler);
  }

  #unbindEventHandlers() {
    this.element.querySelector('.event__rollup-btn')
      .removeEventListener('click', this.#onCloseHandler);
    this.element.querySelector('.event__reset-btn')
      .removeEventListener('click', this.#onCloseHandler);
    this.element.querySelector('.event__save-btn')
      .removeEventListener('submit', this.#onSubmitHandler);
  }

  #onCloseHandler = (evt) => {
    evt.preventDefault();
    this.#closeForm();
  };

  #onSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#submitForm();
    this.#closeForm();
  };

  static parseListElementToState(tripEvent) {
    return {...tripEvent};
  }
}
