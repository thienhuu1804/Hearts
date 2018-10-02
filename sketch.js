var hearts = [];
var bgImg = [];
var heartImg = [];
var linkMedia;
var Media;
var myAudio;
var List;
var linklist = [];
var k = 0;
var bgNow = 0; // background hien tai

var buttonLeft;
var buttonRight;

function preload() {
    // cho het  link vao di
    bgImg[0] = loadImage('image/img1.jpg');
    bgImg[1] = loadImage('image/img2.jpg');
    bgImg[2] = loadImage('image/img3.jpg');
    bgImg[3] = loadImage('image/img4.jpg');
    heartImg[0] = loadImage('image/hearts/heart1.png');
    heartImg[1] = loadImage('image/hearts/heart2.png');
    heartImg[2] = loadImage('image/hearts/heart3.webp');
    List = loadJSON('backmusic.json');

    Media = loadJSON('https://mp3.zing.vn/xhr/media/get-source?type=audio&key=ZmxntZHsJZCGNFATnybnLGyLQdJBcQaJa');
}

function setup() {
    createCanvas(windowWidth, windowHeight).position(0, 0);

    buttonLeft = {
        x: 100,
        y: 100,
        r: 30
    }; // {} la tao 1 object , giong struct ay

    buttonRight = {
        x: width - 100,
        y: 100,
        r: 30
    };

    for (var i = 0; i < List.songlist.length; i++)
        linklist[i] = List.songlist[i].link;
    console.log(List);

    linkMedia = 'http:' + Media.data.source[128];
    //   createNewAudio(linkMedia);
}

function draw() {
    background(bgImg[bgNow]);

    for (i = 0; i < hearts.length; i++) {
        hearts[i].move();
        hearts[i].show();
        hearts[i].check();
    }

    fill(200, 10, 10, 100);
    ellipse(buttonLeft.x, buttonLeft.y, buttonLeft.r * 2, buttonLeft.r * 2);
    ellipse(buttonRight.x, buttonRight.y, buttonRight.r * 2, buttonRight.r * 2);
}

function changeBG(nextOrPre) {
    bgNow += nextOrPre;
    if (bgNow >= bgImg.length) bgNow = 0;
    else if (bgNow < 0) bgNow = bgImg.length - 1;
}

function isInside(x, y, containX, containY, containR) {
    return (p5.Vector.dist(createVector(x, y),
        createVector(containX, containY)) < containR);
}

function mouseClicked() {
    if (isInside(mouseX, mouseY, buttonRight.x, buttonRight.y, buttonRight.r))
        changeBG(1);

    else if (isInside(mouseX, mouseY, buttonLeft.x, buttonLeft.y, buttonLeft.r))
        changeBG(-1);

    else hearts.push(new Heart());
    if (myAudio == null) createNewAudio(linkMedia);
//        myAudio.loop();
}

function nextSong() {
    k++;
    if (k >= List.songlist.length) k = 0;
    Media = loadJSON('https://mp3.zing.vn/xhr/media/get-source?type=audio&key=' + linklist[k],
        function(linkMedia) {
            linkMedia = 'http:' + Media.data.source[128];
            console.log(List.songlist[k].name);
            createNewAudio(linkMedia);
        }
    );


}
class Heart {
    constructor(x, y, anh) {
        this.pos = createVector(x || mouseX, y || mouseY);
        this.vel = createVector(random(-2, 2), random(0, -2));
        this.r = random(30, 100);
        this.heartsIndex = int(random(heartImg.length)); // so luong ảnh có thể hơn 3
        // nên dùng length đi cho chắc , thêm ảnh thì đỡ
        //phải sửa lại chỗ này
        // tên khác đi cho dễ nhớ
    }

    move() {
        this.pos.add(this.vel);
    }

    show() {
        image(heartImg[this.heartsIndex], this.pos.x, this.pos.y, this.r, this.r);
    }

    check() {
        if (this.pos.x < 0 || this.pos.x > width) {
            hearts.splice(hearts.indexOf(this), 1);

        } else if (this.pos.y < 0) {
            this.pos.y = height;
        }
    }
}

function createNewAudio(linkMedia) {
    //    VisualizeGui.linkCurrentSong = linkMedia;
    if (myAudio == null) {
        myAudio = createAudio(linkMedia);
        //        myAudio.elt.controls = false;
        myAudio.autoplay(true);
        myAudio.elt.onended = nextSong;
        myAudio.elt.controls = true;
        //        myAudio.onended(function() {
        //           if (!VisualizeGui.loop) nextPre('next');
        //           else myAudio.play();
        //        });
        //        myAudio.connect(p5.soundOut);

    } else {
        myAudio.src = linkMedia;
    }
}