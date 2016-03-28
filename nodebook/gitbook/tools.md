## 附录：sed 介绍。

我不准备使用编辑器去编辑，而是依然使用命令行来做这样演示，好处是语义化，只要看命令就知道在做什么，不需要啰嗦的去讲操作过程（点击菜单1，在弹出的对话框内填写，点击确定...）。这个命令是sed。语法是：

    sed -i 's/oldstring/newstring/g' filename

解释:

    sed = Stream EDitor
    -i = in-place (i.e. save back to the original file)
    The command string:

    s = the substitute command
    original = a regular expression describing the word to replace (or just the word itself)
    new = the text to replace it with
    g = global (i.e. replace all and not just the first occurrence)
    file.txt = the file name

比如说

    sed -i 's/line1/lineI/g' file1

就可以把代码中的所有 Line1 改成 LineI 。在OS X上此命令需要稍作修改，在-i参数后制定文件扩展名：

    sed -i.bak  's/line1/lineI/' file1

因为OS X 要求inplace修改文件必须指定备份文件的扩展名，并使用此扩展名为被修改文件制作备份文件。
