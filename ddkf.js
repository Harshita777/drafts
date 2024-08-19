 const renderContent = () => {
    switch (value) {
      case 0:
        return <div>All Page Content</div>;
      case 1:
        return <div>Single Page Content</div>;
      case 2:
        return <div>File Upload Page Content</div>;
      default:
        return <div>All Page Content</div>;
    }
  };


<Box mt={2}>{renderContent()}</Box>

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

const [value, setValue] = useState(0);
