// Cloudflare Pages Function - cookieless tracking klikniecia w telefon.
// Endpoint: POST /track  (wywolywany przez navigator.sendBeacon ze strony)
//
// Konfiguracja po stronie Cloudflare (jednorazowo):
//   1. Utworz dataset Analytics Engine (np. "tel_clicks").
//   2. W ustawieniach Pages > Functions > Analytics Engine bindings dodaj
//      binding o nazwie TELEMETRY wskazujacy na ten dataset.
// Bez bindingu funkcja po prostu odpowiada 204 i nic nie zapisuje (nie psuje strony).

export async function onRequestPost(context) {
  try {
    const data = await context.request.json().catch(() => ({}));
    const event = (data && data.event) ? String(data.event) : 'unknown';

    if (context.env && context.env.TELEMETRY) {
      context.env.TELEMETRY.writeDataPoint({
        blobs: [event, context.request.headers.get('referer') || ''],
        doubles: [1],
        indexes: ['phone_click'],
      });
    }
  } catch (e) {
    // celowo ciche - tracking nigdy nie moze blokowac uzytkownika
  }
  return new Response(null, { status: 204 });
}

// Odpowiedz na ewentualne preflight/GET (np. test w przegladarce)
export async function onRequestGet() {
  return new Response('ok', { status: 200 });
}
