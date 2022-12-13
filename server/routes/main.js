module.exports = function (app, fs, connection, path) {
  app.get("/api", (req, res) => {});

  app.get("/api/search/id/:id", (req, res) => {
    connection.query(
      "SELECT u_id, nickname, admin from user_info where u_id=?",
      req.params.id,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    );
  });

  app.get("/api/search/nickname/:nickname", (req, res) => {
    let nickname = req.params.nickname.trim()
    console.log(nickname)
    connection.query(
      "SELECT * from user_info where nickname = ?",
      nickname,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    );
  });

  app.get("/api/search/userinfo/:id/:hint/:answer", (req, res) => {
    connection.query(
      "SELECT u_id from user_info where u_id=? and pw_hint=? and hint_value_hash=sha2(?, 224);",
      [req.params.id, req.params.hint, req.params.answer],
      (error, rows, fields) => {
        if (error) throw error
        res.json(rows);
      }
    )
  })

  app.get("/api/search/post", (req, res) => {
    connection.query(
      "select post_num, post_title, u_id, write_date, read_count, comment_count, nickname from post order by post_num desc;",
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.get("/api/search/postbytitle/:keyword", (req, res) => {
    let keyword = '%' + req.params.keyword + '%';
    connection.query(
      "select post_num, post_title, u_id, write_date, read_count, comment_count, nickname from post where post_title like ? order by post_num desc;",
      keyword,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })
  
  app.get("/api/search/postbyname/:keyword", (req, res) => {
    let keyword = '%' + req.params.keyword + '%';
    connection.query(
      "select post_num, post_title, u_id, write_date, read_count, comment_count, nickname from post where nickname like ? order by post_num desc;",
      keyword,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.get("/api/search/mypost/:keyword", (req, res) => {
    let keyword = req.params.keyword
    connection.query(
      "select post_num, post_title, u_id, write_date, read_count, comment_count, nickname from post where nickname = ? order by post_num desc;",
      keyword,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.get("/api/search/post/:postnum", (req, res) => {
    connection.query(
      "select * from post where post_num = ?",
      req.params.postnum,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.get("/api/search/comment/:postnum", (req, res) => {
    connection.query(
      "select * from post_comment where post_num = ?",
      req.params.postnum,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.get("/api/search/postcount/:u_id", (req, res) => {
    connection.query(
      "select count(*) as count from post where u_id = ?",
      req.params.u_id,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.get('/api/search/music/:u_id', (req, res) => {
    connection.query(
      "select music.track_num, music_title, composer, thumbnail_url, length from music natural join music_list where u_id=?;",
      req.params.u_id,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.get('/api/search/musicbynum/:track_num', (req, res) => {
    connection.query(
      "select * from music where track_num = ?;",
      req.params.track_num,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.get('/api/search/musiclist/:u_id/:track_num', (req, res) => {
    connection.query(
      'select * from music_list where u_id = ? and track_num = ?;',
      [req.params.u_id, req.params.track_num],
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.put("/api/change", (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;
    connection.query(
      "update user_info set pw_hash = sha2(?, 224) where u_id = ?;",
      [pw, id],
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.put("/api/add/count", (req, res) => {
    let postnum = req.body.post_num;
    connection.query(
      "update post set read_count = read_count + 1 where post_num = ?;",
      postnum,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.post("/api/add/comment", (req, res) => {
    let postnum = req.body.postnum;
    let u_id = req.body.u_id;
    let comment = req.body.comment;
    let nickname = req.body.nickname
    connection.query(
      "insert into post_comment (c_content, u_id, post_num, nickname) values (?, ?, ?, ?);",
      [comment, u_id, postnum, nickname],
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    ) 
  })

  app.post("/api/add/post", (req, res) => {
    let post_title = req.body.post_title;
    let p_content = req.body.p_content;
    let u_id = req.body.u_id;
    let nickname = req.body.nickname;
    connection.query(
      "insert into post (post_title, p_content, u_id, nickname) values (?, ?, ?, ?);",
      [post_title, p_content, u_id, nickname],
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.post("/api/add/music", (req, res) => {
    let track_num = req.body.track_num;
    let music_title = req.body.music_title;
    let composer = req.body.composer;
    let thumbnail_url =req.body.thumbnail_url;
    let length = req.body.length;
    connection.query(
      "insert into music values (?, ?, ?, ?, ?);",
      [track_num, music_title, composer, thumbnail_url, length],
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.post('/api/add/musiclist', (req, res) => {
    let u_id = req.body.u_id;
    let track_num = req.body.track_num;
    connection.query(
      "insert into music_list values (?, ?)",
      [u_id, track_num],
      (error, rows, fields) => {
        if(error) throw error;
        res.json(rows);
      }
    )
  })

  app.put("/api/edit/post", (req, res) => {
    let post_title = req.body.post_title;
    let p_content = req.body.p_content;
    let post_num = req.body.post_num;
    connection.query(
      "update post set post_title = ?, p_content = ? where post_num = ?;",
      [post_title, p_content, post_num],
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.delete("/api/delete/comment", (req, res) => {
    let commentNum = req.body.commentnum;
    connection.query(
      "delete from post_comment where comment_num = ?;",
      commentNum,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.delete("/api/delete/post", (req, res) => {
    let postnum = req.body.postnum;
    connection.query(
      "delete from post where post_num = ?;",
      postnum,
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.delete("/api/delete/musiclist", (req, res) => {
    let u_id = req.body.u_id;
    let track_num = req.body.track_num;
    connection.query(
      "delete from music_list where u_id = ? and track_num = ?;",
      [u_id, track_num],
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  })

  app.get("/api/login/:id/:pw", (req, res) => {
    connection.query(
      "select u_id, nickname, admin from user_info where u_id=? and pw_hash=sha2(?, 224);",
      [req.params.id, req.params.pw],
      (error, rows, fields) => {
        if (error) throw error;
        res.json(rows);
      }
    )
  });

  app.post("/api/regist", (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;
    let nickname = req.body.nickname;
    let hint = req.body.hint;
    let hint_answer = req.body.hint_answer;

    connection.query(
      "insert into user_info values (?, sha2(?, 224), ?,  ?, sha2(?, 224), false)",
      [id, pw, nickname, hint, hint_answer],
      (error, result, fields) => {
        if (error) throw error;
        res.json(result);
      }
    )
  })

/*  app.post('/api/image/upload', upload.single('img'), (req, res) => {
   console.log('test')
  }) */

  app.post('/api/image/upload', (req, res, next) => {
    let uploadFile = req.files.file;
    const fileName = req.files.file.name;
    console.log(uploadFile);
    console.log(fileName);
    uploadFile.mv(
      'E:/React/project/server/images/' + fileName,
      (err) => {
        if (err) {
          return res.status(500).send(err)
        }
        res.json(JSON.stringify({
          url : 'http://localhost:3001/api/get/image/' + fileName,
        }))
      }
    )
  })

  app.get('/api/get/image/:filename', (req, res) => {
    let filename = req.params.filename;
    res.sendFile('E:/React/project/server/images/' + filename);
  })
};


//'home/react/server/images/' + fileName
// E:/React/project/server/images

