import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

function PageLoading({ loading }) {
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
      <LinearProgress color="thirdly" />
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
