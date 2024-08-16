<Grid item xs={12}>
  <Card className='shadow-none p-2 h-auto border rounded-1xl' elevation={3}>
    <Box className='flex justify-between'>
      <Text variant='h4' className='mt-4 ml-2 font-normal'> Pending Activities </Text>
      <Button onClick={handleRefresh} variant='tertiary'>Refresh</Button>
    </Box>

    <Box className='flex p-3 gap-5'>
      {pendingState?.data?.map((item, index) => {
        const category = Object.keys(item)[0]; // Gets the key: 'pending-all', 'telegraphics', 'withinbank'
        const details = item[category][0]; // Gets the details inside the array

        // Create a mapping for category titles
        const categoryTitles = {
          'pending-all': 'All',
          'telegraphics': 'Telegraphic',
          'withinbank': 'Within Bank'
        };

        return (
          <Card key={index} className="shadow border mt-2 w-2/5 p-3 rounded-lg">
            <Box className='flex justify-between'>
              <Text variant='h5' className="font-normal">{categoryTitles[category]}</Text>
              <IconButton className="text-gray-500"><ChevronRightSmall /></IconButton>
            </Box>

            <Text variant='label3' className="text-gray-500">
              {details.count} Individual Transactions
            </Text>
            <Div className='flex justify-between'>
              <Text variant='label3' className="text-gray-500">
                {details.files} Files
              </Text>
              <Text variant='label3' className="text-md font-semibold text-gray-600">
                {details.amount}
              </Text>
            </Div>
          </Card>
        );
      })}
    </Box>
  </Card>
</Grid>
