pandoc -s -o http.docx  readme.md \
  1.introduction.md \
  2.term.md \
  3.test-suite.md \
  4.history.md \
  5.request/readme.md \
  5.request/1.get.md \
  5.request/2.post.md \
  5.request/3.options.md \
  5.request/4.put+delete.md \
  5.request/5.connect.md \
  6.response/readme.md \
  6.response/1.200.md \
  6.response/2.300.md \
  6.response/3.400.md \
  6.response/4.500.md \
  6.response/5.100.md \
  6.response/6.101.md \
  7.message-body.md \
  8.connection.md \
  9.client-identity.md \
  --toc --toc-depth=2 
 