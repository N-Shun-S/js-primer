console.log("index.js: loaded");

// ex
//const userId = "N-Shun-S";
//const userId = "Sample-testsfdfdfdfdfdfdfd";

//アプリケーションにエントリーポイントを設ける（エラーハンドリングを行いやすくするため）

// function main() {
//   fetchUserInfo("js-primer-example")
//     //ここではJSONオブジェクトで解決されるPromise
//     .then((userInfo) => createView(userInfo))
//     //ここではHTML文字列で解決されるPromise
//     .then((view) => displayView(view))
//     //Promiseチェーンでエラーがあった場合はキャッチされる
//     .catch((error) => {
//       console.log(`エラーが発生しました(${error})`);
//     });
// }

async function main() {
  try {
    const userId = getUserId();
    const userInfo = await fetchUserInfo(userId);
    const view = createView(userInfo);
    displayView(view);
  } catch (error) {
    console.log(`エラーが発生しました(${error})`);
  }
}

//指定したGitHubユーザーIDの情報を取得
function fetchUserInfo(userId) {
  //fetchの返り値のPromiseをreturnする
  return fetch(
    `https://api.github.com/users/${encodeURIComponent(userId)}`
  ).then((response) => {
    if (!response.ok) {
      //エラーレスポンスからRejectedなPromiseを作成して返す
      return Promise.reject(
        new Error(`${response.status}: ${response.statusText}`)
      );
    } else {
      //JSONオブジェクトで解決されるPromiseを返す
      return response.json();
    }
  });
}

function getUserId() {
  return document.getElementById("userId").value;
}

//HTMLの組み立て
function createView(userInfo) {
  return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
        <dt>Location</dt>
        <dd>${userInfo.location}</dd>
        <dt>Repositories</dt>
        <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
}
//HTMLの挿入
function displayView(view) {
  const result = document.getElementById("result");
  result.innerHTML = view;
}

function escapeSpecialChars(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//タグ関数？
function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}
