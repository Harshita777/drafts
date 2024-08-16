<Grid item xs={12}>
  <Card className='shadow-none p-2 h-auto border rounded-1xl' elevation={3}>
    <Box className='flex justify-between'>
      <Text variant='h4' className='mt-4 ml-2 font-normal'> Pendings Activities </Text>
      <Button onClick={handleRefresh} variant='tertiary'>Refresh</Button>
    </Box>

    <Box className='flex p-3 gap-5 '>
      <Card className="shadow border mt-2 w-2/5 p-3 rounded-lg">
        <Box className='flex justify-between'>
          <Text variant='h5' className="font-normal">All</Text>
          <IconButton className="text-gray-500"><ChevronRightSmall /></IconButton>
        </Box>

        <Text variant='label3' className="text-gray-500">
          {pendingState?.data[0]?.['pending-all'][0]?.count} Individual Transactions
        </Text>
        <Div className='flex justify-between'>
          <Text variant='label3' className="text-gray-500">
            {pendingState?.data[0]?.['pending-all'][0]?.files} Files
          </Text>
          <Text variant='label3' className="text-md font-semibold text-gray-600">
            {pendingState?.data[0]?.['pending-all'][0]?.amount}
          </Text>
        </Div>
      </Card>

      <Card className="shadow mt-2 border w-2/5 p-3 rounded-lg">
        <Box className='flex justify-between'>
          <Text variant="h5" className="font-normal">Telegraphic</Text>
          <IconButton className="text-gray-500"><ChevronRightSmall /></IconButton>
        </Box>

        <Text variant='label3' className="text-gray-500">
          {pendingState?.data[1]?.telegraphics[0]?.count} Individual Transactions
        </Text>
        <Div className='flex justify-between'>
          <Text variant='label3' className="text-gray-500">
            {pendingState?.data[1]?.telegraphics[0]?.files} Files
          </Text>
          <Text variant='label3' className="text-md font-semibold text-gray-600">
            {pendingState?.data[1]?.telegraphics[0]?.amount}
          </Text>
        </Div>
      </Card>

      <Card className="shadow mt-2 border w-2/5 p-3 rounded-lg">
        <Box className='flex justify-between'>
          <Text variant="h5" className="font-normal">Within Bank</Text>
          <IconButton className="text-gray-500"><ChevronRightSmall /></IconButton>
        </Box>

        <Text variant='label3' className="text-gray-500">
          {pendingState?.data[2]?.withinbank[0]?.count} Individual Transactions
        </Text>
        <Div className='flex justify-between'>
          <Text variant='label3' className="text-gray-500">
            {pendingState?.data[2]?.withinbank[0]?.files} Files
          </Text>
          <Text variant='label3' className="text-md font-semibold text-gray-600">
            {pendingState?.data[2]?.withinbank[0]?.amount}
          </Text>
        </Div>
      </Card>
    </Box>
  </Card>
</Grid>
