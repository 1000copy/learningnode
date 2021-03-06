pandoc -o gitbook.epub  1.readme.md \
                      2.ready.md \
                      basic/1.intro.md \
                      basic/2.stage.md \
                      basic/3.undo.md \
                      basic/4.branch.md  \
                      basic/7.revision.md \
                      basic/8.duorepo.md \
                      more/5.tag.md \
                      protocols/readme.md \
                      protocols/1.git.md \
                      protocols/2.ssh.md \
                      protocols/3.http.md \
                      9.paperback.md \
 --toc --toc-depth=2 
 ./kindlegen gitbook.epub