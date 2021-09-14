# If there's a prisma/schema.prisma, it deletes it and creates a new one.
# After that, it iterates through prisma/schemas (you should create this folder
# and add your schemas in there) and pastes the content of each schema into
# prisma/schema.prisma.

# It doesn't matter if the file has spaces in both start and beginning, it's
# purely aesthethic. You can have a "base" file containing generators, datasources, and extra 
# use-case specific things.

prismaDir='prisma'

if [ -d $prismaDir/schemas ]; then
  if [ ! -f $prismaDir/schema.prisma ]; then
    touch $prismaDir/schema.prisma

    if [ -f $prismaDir/base.prisma ]; then
      cat $prismaDir/base.prisma >> $prismaDir/schema.prisma
    fi

    for schema in $(ls $prismaDir/schemas); do
      cat $prismaDir/schemas/$schema >> $prismaDir/schema.prisma
    done
  else
    rm $prismaDir/schema.prisma
    echo 'Re-run the script to update the schema.'
  fi
fi
