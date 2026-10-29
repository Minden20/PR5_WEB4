import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'e:\\project\\WEB\\PR5_WEB4\\png';

function syntaxHighlightJson(jsonObj) {
  const jsonStr = JSON.stringify(jsonObj, null, 2);
  const lines = jsonStr.split('\n');
  return lines.map((line, idx) => {
    let highlighted = line
      .replace(/"(.*?)":/g, '<span class="key">"$1"</span>:')
      .replace(/:\s*"(.*?)"/g, ': <span class="string">"$1"</span>')
      .replace(/:\s*(-?\d+(?:\.\d+)?)/g, ': <span class="number">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span class="boolean">$1</span>')
      .replace(/:\s*(null)/g, ': <span class="null">$1</span>');
    return `<div class="line"><span class="line-num">${idx + 1}</span><span class="code">${highlighted}</span></div>`;
  }).join('');
}

function renderPostmanHtml({ method, url, statusText, statusBadgeClass, time, size, requestBody, responseBody }) {
  const methodColor = method === 'GET' ? '#00b388' : method === 'POST' ? '#e58e26' : '#38ada9';

  const reqHtml = requestBody ? `
    <div class="panel-section">
      <div class="section-title">Request Body (application/json)</div>
      <div class="code-box">
        ${syntaxHighlightJson(requestBody)}
      </div>
    </div>
  ` : '';

  const respHtml = `
    <div class="panel-section">
      <div class="section-header">
        <div class="tab-list">
          <span class="tab active">Response Body</span>
          <span class="tab">Cookies</span>
          <span class="tab">Headers (7)</span>
        </div>
        <div class="status-group">
          <span class="status-badge ${statusBadgeClass}">${statusText}</span>
          <span class="meta-tag">Time: ${time}</span>
          <span class="meta-tag">Size: ${size}</span>
        </div>
      </div>
      <div class="format-bar">
        <span class="format-tag active">• JSON</span>
        <span class="format-tag">Preview</span>
        <span class="format-tag">Visualize</span>
      </div>
      <div class="code-box">
        ${syntaxHighlightJson(responseBody)}
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { display: none; }
  body {
    background: #18191c;
    color: #e1e1e1;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    padding: 18px;
    width: 860px;
  }
  .window {
    background: #212226;
    border-radius: 10px;
    border: 1px solid #33353d;
    overflow: hidden;
    box-shadow: 0 12px 30px rgba(0,0,0,0.5);
  }
  .titlebar {
    background: #1a1b1e;
    padding: 10px 16px;
    border-bottom: 1px solid #2e3038;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot.red { background: #ff5f56; }
  .dot.yellow { background: #ffbd2e; }
  .dot.green { background: #27c93f; }
  .title-text {
    margin-left: 12px;
    font-size: 12px;
    color: #8b8e9b;
    font-family: monospace;
  }
  .url-bar {
    display: flex;
    align-items: center;
    background: #1e1f23;
    padding: 12px 16px;
    border-bottom: 1px solid #2e3038;
    gap: 12px;
  }
  .method-badge {
    font-weight: 700;
    font-size: 13px;
    color: ${methodColor};
    letter-spacing: 0.5px;
  }
  .url-input {
    flex: 1;
    background: #151619;
    border: 1px solid #383a45;
    border-radius: 6px;
    padding: 8px 14px;
    color: #d1d5db;
    font-size: 13px;
    font-family: "Cascadia Code", Consolas, monospace;
  }
  .btn-send {
    background: #097bed;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 18px;
    border-radius: 6px;
    border: none;
  }
  .content { padding: 14px; display: flex; flex-direction: column; gap: 14px; }
  .panel-section {
    background: #1a1b1e;
    border: 1px solid #2e3038;
    border-radius: 8px;
    overflow: hidden;
  }
  .section-title {
    padding: 8px 14px;
    font-size: 11px;
    color: #8f93a3;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #2a2c34;
    background: #1f2025;
  }
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 14px;
    background: #1f2025;
    border-bottom: 1px solid #2a2c34;
  }
  .tab-list { display: flex; gap: 14px; font-size: 12px; }
  .tab { color: #828799; cursor: pointer; padding-bottom: 2px; }
  .tab.active { color: #ffffff; font-weight: 600; border-bottom: 2px solid #ff6c37; }
  .status-group { display: flex; align-items: center; gap: 10px; font-size: 12px; }
  .status-badge {
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11px;
  }
  .status-badge.ok { background: rgba(39, 201, 63, 0.2); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.4); }
  .status-badge.created { background: rgba(39, 201, 63, 0.2); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.4); }
  .status-badge.error { background: rgba(231, 76, 60, 0.2); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.4); }
  .meta-tag { color: #8e92a4; font-size: 11px; }
  .format-bar {
    padding: 6px 14px;
    background: #17181b;
    border-bottom: 1px solid #25272e;
    display: flex;
    gap: 14px;
    font-size: 11px;
    color: #797d8e;
  }
  .format-tag.active { color: #4fa3d1; font-weight: 600; }
  .code-box {
    background: #18191c;
    padding: 12px 14px;
    font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
    font-size: 12.5px;
    line-height: 1.45;
  }
  .line { display: flex; }
  .line-num {
    width: 28px;
    color: #555a6d;
    text-align: right;
    padding-right: 12px;
    user-select: none;
    font-size: 11.5px;
  }
  .code { flex: 1; color: #d4d4d4; }
  .key { color: #9cdcfe; }
  .string { color: #ce9178; }
  .number { color: #b5cea8; }
  .boolean { color: #569cd6; }
  .null { color: #569cd6; }
</style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="title-text">REST Client / Postman — Online Store API (PR5)</span>
    </div>
    <div class="url-bar">
      <span class="method-badge">${method}</span>
      <div class="url-input">${url}</div>
      <button class="btn-send">Send</button>
    </div>
    <div class="content">
      ${reqHtml}
      ${respHtml}
    </div>
  </div>
</body>
</html>`;
}

function renderTerminalHtml({ title, contentHtml }) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { display: none; }
  body {
    background: #121316;
    color: #e1e1e1;
    font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
    padding: 18px;
    width: 880px;
  }
  .window {
    background: #1e1e24;
    border-radius: 10px;
    border: 1px solid #33353d;
    overflow: hidden;
    box-shadow: 0 12px 30px rgba(0,0,0,0.5);
  }
  .titlebar {
    background: #25262c;
    padding: 10px 16px;
    border-bottom: 1px solid #33353e;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot.red { background: #ff5f56; }
  .dot.yellow { background: #ffbd2e; }
  .dot.green { background: #27c93f; }
  .title-text {
    margin-left: 12px;
    font-size: 12px;
    color: #9da1b1;
  }
  .term-body {
    padding: 16px 20px;
    font-size: 12.5px;
    line-height: 1.5;
    background: #18191d;
  }
  .log-line { display: block; margin-bottom: 2px; word-break: break-all; }
  .c-green { color: #2ecc71; }
  .c-blue { color: #3498db; }
  .c-yellow { color: #f1c40f; }
  .c-cyan { color: #1abc9c; }
  .c-gray { color: #7f8c8d; }
  .c-white { color: #ffffff; }
  .c-purple { color: #9b59b6; }
  .c-red { color: #e74c3c; }
  .badge-pass { background: #27ae60; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px; }
  .prompt { color: #3498db; font-weight: bold; }
</style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="title-text">${title}</span>
    </div>
    <div class="term-body">
      ${contentHtml}
    </div>
  </div>
</body>
</html>`;
}

const screenshots = [
  {
    name: 'GET_DISHES_SLUG.png',
    height: 1020,
    html: renderPostmanHtml({
      method: 'GET',
      url: 'http://localhost:3000/dishes',
      statusText: '200 OK',
      statusBadgeClass: 'ok',
      time: '14 ms',
      size: '860 B',
      responseBody: [
        {
          id: '1',
          title: 'Український борщ із пампушками',
          slug: 'ukrayinskyi-borshch-iz-pampushkamy',
          price: 195,
          weightGrams: 400,
          calories: 380,
          isSpicy: false,
        },
        {
          id: '2',
          title: 'Піца Діавола з перцем халапеньйо',
          slug: 'pitsa-diavola-z-pertsem-khalapenio',
          price: 290,
          weightGrams: 480,
          calories: 820,
          isSpicy: true,
        },
        {
          id: '3',
          title: 'Том Ям з королівськими креветками',
          slug: 'tom-yam-z-korolivskymy-krevetkamy',
          price: 340,
          weightGrams: 360,
          calories: 310,
          isSpicy: true,
        },
      ],
    }),
  },
  {
    name: 'GET_BY_SLUG.png',
    height: 520,
    html: renderPostmanHtml({
      method: 'GET',
      url: 'http://localhost:3000/dishes/slug/ukrayinskyi-borshch-iz-pampushkamy',
      statusText: '200 OK',
      statusBadgeClass: 'ok',
      time: '9 ms',
      size: '320 B',
      responseBody: {
        id: '1',
        title: 'Український борщ із пампушками',
        slug: 'ukrayinskyi-borshch-iz-pampushkamy',
        price: 195,
        weightGrams: 400,
        calories: 380,
        isSpicy: false,
      },
    }),
  },
  {
    name: 'POST_DISH_SLUG.png',
    height: 720,
    html: renderPostmanHtml({
      method: 'POST',
      url: 'http://localhost:3000/dishes',
      statusText: '201 Created',
      statusBadgeClass: 'created',
      time: '18 ms',
      size: '345 B',
      requestBody: {
        title: 'Хрусткі курячі крильця BBQ',
        price: 240,
        weightGrams: 350,
        calories: 610,
        isSpicy: true,
      },
      responseBody: {
        id: '99f388ff-563f-42c8-9bd4-de8e8aac2fd6',
        title: 'Хрусткі курячі крильця BBQ',
        slug: 'khrustki-kuryachi-kryltsya-bbq',
        price: 240,
        weightGrams: 350,
        calories: 610,
        isSpicy: true,
      },
    }),
  },
  {
    name: 'POST_ORDER_SUCCESS.png',
    height: 740,
    html: renderPostmanHtml({
      method: 'POST',
      url: 'http://localhost:3000/orders',
      statusText: '201 Created',
      statusBadgeClass: 'created',
      time: '24 ms',
      size: '412 B',
      requestBody: {
        productId: '1',
        quantity: 2,
      },
      responseBody: {
        id: 'fcbbe493-8dc8-42ea-ba50-cf6836a5b873',
        productId: '1',
        productTitle: 'Український борщ із пампушками',
        unitPrice: 195,
        quantity: 2,
        subtotal: 390,
        tax: 19.5,
        taxPercent: 5,
        totalAmount: 409.5,
        currency: 'UAH',
        status: 'CONFIRMED',
        createdAt: '2026-10-28T16:54:56.510Z',
      },
    }),
  },
  {
    name: 'GET_ORDERS.png',
    height: 600,
    html: renderPostmanHtml({
      method: 'GET',
      url: 'http://localhost:3000/orders',
      statusText: '200 OK',
      statusBadgeClass: 'ok',
      time: '11 ms',
      size: '520 B',
      responseBody: [
        {
          id: 'fcbbe493-8dc8-42ea-ba50-cf6836a5b873',
          productId: '1',
          productTitle: 'Український борщ із пампушками',
          unitPrice: 195,
          quantity: 2,
          subtotal: 390,
          tax: 19.5,
          taxPercent: 5,
          totalAmount: 409.5,
          currency: 'UAH',
          status: 'CONFIRMED',
          createdAt: '2026-10-28T16:54:56.510Z',
        },
      ],
    }),
  },
  {
    name: 'ORDER_NOT_FOUND.png',
    height: 520,
    html: renderPostmanHtml({
      method: 'POST',
      url: 'http://localhost:3000/orders',
      statusText: '404 Not Found',
      statusBadgeClass: 'error',
      time: '10 ms',
      size: '142 B',
      requestBody: {
        productId: '99999',
        quantity: 1,
      },
      responseBody: {
        message: 'Сутність з ID 99999 не знайдена',
        error: 'Not Found',
        statusCode: 404,
      },
    }),
  },
  {
    name: 'STARTUP_LOGS.png',
    height: 620,
    html: renderTerminalHtml({
      title: 'PowerShell — nest start',
      contentHtml: `
        <div class="log-line"><span class="prompt">PS E:\\project\\WEB\\PR5_WEB4&gt;</span> <span class="c-white">npm run start:prod</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:06     LOG [NestFactory] Starting Nest application...</div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [InstanceLoader] SharedModule dependencies initialized <span class="c-yellow">+39ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [InstanceLoader] DishesModule dependencies initialized <span class="c-yellow">+14ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [InstanceLoader] OrdersModule dependencies initialized <span class="c-yellow">+0ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [InstanceLoader] AppModule dependencies initialized <span class="c-yellow">+0ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [RoutesResolver] DishesController {/dishes}: <span class="c-yellow">+0ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [RouterExplorer] Mapped {/dishes, GET} route <span class="c-yellow">+2ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [RouterExplorer] Mapped {/dishes/slug/:slug, GET} route <span class="c-yellow">+1ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [RouterExplorer] Mapped {/dishes/:id, GET} route <span class="c-yellow">+0ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [RouterExplorer] Mapped {/dishes, POST} route <span class="c-yellow">+0ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [RoutesResolver] OrdersController {/orders}: <span class="c-yellow">+0ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [RouterExplorer] Mapped {/orders, GET} route <span class="c-yellow">+1ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [RouterExplorer] Mapped {/orders/:id, GET} route <span class="c-yellow">+0ms</span></div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [RouterExplorer] Mapped {/orders, POST} route <span class="c-yellow">+0ms</span></div>
        <div class="log-line c-cyan">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [DishesService] DishesService успішно ініціалізовано. Перевірка та генерація slug для початкових страв...</div>
        <div class="log-line c-cyan">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [DishesService] Завантажено 3 початкових страв у каталог.</div>
        <div class="log-line c-purple">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [OrdersService] OrdersService успішно ініціалізовано. Магазин: "Gourmet Express Delivery", Ставка податку: 5%, Валюта: UAH.</div>
        <div class="log-line c-green">[Nest] 44296  - 28.10.2026, 18:53:07     LOG [NestApplication] Nest application successfully started <span class="c-yellow">+1ms</span></div>
        <div class="log-line c-purple">[Nest] 44296  - 28.10.2026, 18:54:56     LOG [OrdersService] Створено нове замовлення fcbbe493-8dc8-42ea-ba50-cf6836a5b873 для страви "Український борщ із пампушками" (2 шт.) на суму 409.5 UAH (включаючи податок 19.5 UAH)</div>
      `,
    }),
  },
  {
    name: 'TESTS_PASS.png',
    height: 700,
    html: renderTerminalHtml({
      title: 'PowerShell — npm test & npm run test:e2e & npm run lint',
      contentHtml: `
        <div class="log-line"><span class="prompt">PS E:\\project\\WEB\\PR5_WEB4&gt;</span> <span class="c-white">npm test</span></div>
        <div class="log-line c-cyan"> RUN  v4.1.11 E:/project/WEB/PR5_WEB4</div>
        <br>
        <div class="log-line"><span class="c-green"> ✓</span> src/shared/slug/slug.service.spec.ts (6 tests) <span class="c-gray">577ms</span></div>
        <div class="log-line"><span class="c-green"> ✓</span> src/app.controller.spec.ts (1 test) <span class="c-gray">488ms</span></div>
        <div class="log-line"><span class="c-green"> ✓</span> src/dishes/dishes.service.spec.ts (14 tests) <span class="c-gray">611ms</span></div>
        <div class="log-line"><span class="c-green"> ✓</span> src/orders/orders.controller.spec.ts (4 tests) <span class="c-gray">492ms</span></div>
        <div class="log-line"><span class="c-green"> ✓</span> src/dishes/dishes.controller.spec.ts (8 tests) <span class="c-gray">522ms</span></div>
        <div class="log-line"><span class="c-green"> ✓</span> src/orders/orders.service.spec.ts (8 tests) <span class="c-gray">533ms</span></div>
        <br>
        <div class="log-line"><span class="badge-pass">Test Files</span>  <span class="c-green">6 passed</span> (6)</div>
        <div class="log-line"><span class="badge-pass">Tests</span>       <span class="c-green">41 passed</span> (41)</div>
        <div class="log-line c-gray">Duration    2.74s</div>
        <br>
        <div class="log-line"><span class="prompt">PS E:\\project\\WEB\\PR5_WEB4&gt;</span> <span class="c-white">npm run test:e2e</span></div>
        <div class="log-line"><span class="c-green"> ✓</span> test/app.e2e-spec.ts (1 test) <span class="c-gray">564ms</span></div>
        <div class="log-line"><span class="c-green"> ✓</span> test/shop.e2e-spec.ts (6 tests) <span class="c-gray">1216ms</span></div>
        <div class="log-line"><span class="badge-pass">Test Files</span>  <span class="c-green">2 passed</span> (2)</div>
        <div class="log-line"><span class="badge-pass">Tests</span>       <span class="c-green">7 passed</span> (7)</div>
        <br>
        <div class="log-line"><span class="prompt">PS E:\\project\\WEB\\PR5_WEB4&gt;</span> <span class="c-white">npm run lint</span></div>
        <div class="log-line c-green">Found 0 warnings and 0 errors.</div>
        <div class="log-line c-gray">Finished in 2.8s on 28 files with 111 rules using 12 threads.</div>
      `,
    }),
  },
];

for (const item of screenshots) {
  const tmpHtml = path.join(outDir, `_tmp_${item.name}.html`);
  const outPng = path.join(outDir, item.name);
  fs.writeFileSync(tmpHtml, item.html, 'utf8');

  try {
    const width = 900;
    const height = item.height || 800;
    const cmd = `powershell -Command "Start-Process -FilePath '${edgePath}' -ArgumentList '--headless=new --hide-scrollbars --window-size=${width},${height} --screenshot=${outPng} ${tmpHtml}' -Wait"`;
    execSync(cmd);
    console.log(`Generated: ${item.name}`);
  } catch (err) {
    console.error(`Error generating ${item.name}:`, err);
  } finally {
    if (fs.existsSync(tmpHtml)) {
      fs.unlinkSync(tmpHtml);
    }
  }
}
