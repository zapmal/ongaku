web_files_count=`git --no-pager diff --name-only --cached | grep -E "web" | wc -l`

if [ $web_files_count -eq 0 ] 
then
  exit 0
fi

exit 1