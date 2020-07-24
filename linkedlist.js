/**
 * 連結リスト(リンクリスト)：データ構造
 * 連結リストにはいくつかの種類があり、片方向リスト、双方向リスト、線形リスト、循環リストなどがある。
 * Reactのhooksは片方向リストで実現するのだ。
 * 片方向リスト（singly-linked list）は、最も単純な連結リストである。リストの最後尾ならNull値を格納するか、空のリストを指す。
 * 沢山のノードを組み合わせて連結リストになる。一つのノード：要素とリンク。ノード毎に1つのリンクと要素を持つ。このリンクはリスト上の次のノード（の場所）を指す（ハードディスク上のアドレス。全てのデータはハードディスクに保存しているので）。
 * データが要素にある。簡単というと、要素はデータである。
 * 
 * 
 * Fiberの色んなところで片方向リストを使用している。
 */


//  Updateは一つのノード
 class Update {
     constructor(payload, nextUpdate) {
        this.payload = payload;　// payloadは要素である
        this.nextUpdate = nextUpdate; //次のノードを指すリンク
     }
 }

//  更新のキュー（待ち行列）
class UpdateQueue {
    constructor() {
        //　ReactのデータはStateに保存する。
        this.baseState = null; //　stateの初期値。最初はnullの状態
        this.firstUpdate = null;　// firstUpdate最初どこにも指していない
        this.lastUpdate = null; //　lastUpdate最初どこにも指していない
    }
    enqueueUpdate(update) {
        // リンクの操作
        // 初めての時、firstUpdateはnull。この際stateはまだ何もない状態
        if(this.firstUpdate == null) {
            // firstUpdateとlastUpdateの指す場所にupdateの値を代入させる
            // 初のノードだから、両方の指す場所は同じの第一番のノードであるべき
            this.firstUpdate = this.lastUpdate = update;
        } else {
            // 初の更新じゃない場合、firstUpdateの値はnullじゃない
            // 「ノード毎に1つのリンクと要素を持つ」
            // この所でリンクの指す場所を処理する
            // this.lastUpdateは渡されたノードなので、現時点のlastUpdateは前回渡されたupdateである。（Objectの特徴）
            // lastUpdateはpayloadとnextUpdate2つの属性を持つ。lastUpdateのnextUpdateは今回渡されたupdateのノードになる。
            this.lastUpdate.nextUpdate = update;
            // 同時にlastUpdate自分も今回渡されたupdateを代入する。
            this.lastUpdate = update;
        }
    }

    forceUpdate() {
        // 前の状態を獲得して、連結リストを循環して、更新して、新しい状態を獲得する。
        let currentState = this.baseState || {}; //Stateの初期値
        let currentUpdate = this.firstUpdate; // currentUpdateは一つのノード
        while (currentUpdate) {　//currentUpdateは値がある時
            // 更新するStateを確定する、functionと他の値分別処理
            let nextState = typeof currentUpdate.payload == 'function' ?
            currentUpdate.payload(currentState) : currentUpdate.payload;
            // currentStateを処理、
            // 今回渡されたState(nextState)ともともと存在するState(currentState)を合併して、新しいStateを生成する。
            currentState = { ...currentState, ...nextState };
            // 当ノードは次のノードになる
            // 最後のノードはnextUpdateがないから、nullになる。
            currentUpdate = currentUpdate.nextUpdate;
            // currentUpdateはnullの時、循環終了
        }
        this.firstUpdate = this.lastUpdate = null; // 更新済み、連結リストをクリア
        this.baseState = currentState;　//Stateは今のStateになる。
        // 更新したStateを作用域以外に戻す。外から今のcurrentStateが獲得できる。
        return currentState;
    }

}

// UpdateQueue instance 
let queue = new UpdateQueue();
// 更新リンクの指す場所
queue.enqueueUpdate(new Update({ name: 'zhufeng' }));
queue.enqueueUpdate(new Update({ number: 0 }));
queue.enqueueUpdate(new Update((state) => ({ number: state.number + 1 })));
queue.enqueueUpdate(new Update((state) => ({ number: state.number + 1 })));
// 更新State
queue.forceUpdate();
console.log(queue.baseState);





 /**
  *　Class構文はprototypeベースのクラス定義構文の糖衣構文。従来のprototypeベースの構文より、簡潔かつ明瞭な記述でクラスを定義できる。
  * 関連するポイント：thisは何。prototypeベースの構文は何。（今回のポイントじゃない）
  * 
  * class Person{
  *     constructor(name){
        this.name = name;
     }
       sayHello() {
        console.log("Hello, I'm " + this.getName());   
        }
        getName() {
            return this.name;
        }
  * }
  * 
  */