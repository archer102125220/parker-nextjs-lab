import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface PageLoadingProps {
  loading: boolean;
}

function PageLoading(props: Readonly<PageLoadingProps>) {
  const { loading } = props;

  return loading === true ? (
    <Box
      sx={{
        position: 'absolute',
        width: '100vw',
        top: '0',
        left: '0',
        zIndex: 100
      }}
    >
      <LinearProgress color="primary" />
    </Box>
  ) : (
    <></>
  );
}

PageLoading.propTypes = {
  loading: PropTypes.bool
};

PageLoading.defaultProps = {
  loading: false
};

export default PageLoading;
