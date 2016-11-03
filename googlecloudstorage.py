import logging
import cloudstorage as gcs

#--- google cloude storage ----
class GoogleCloudStorage():
    def __init__(self):
        self.tmp_filenames_to_clean_up = []

    def create_file(self, file_type, filename, text_data):
        logging.info('Creating file %s\n' % filename)
        write_retry_params = gcs.RetryParams(backoff_factor=1.1)

        if file_type == 'text':
            gcs_file = gcs.open(filename, 'w', content_type='text/plain', retry_params=write_retry_params)
            gcs_file.write(text_data.encode('utf-8'))
            gcs_file.close()
        else:
            pass

        self.tmp_filenames_to_clean_up.append(filename)

    def read_file(self, filename):
        logging.info('Read file\n')
        fileavability = 1
        try:
            gcs_file = gcs.open(filename)
            file_data = gcs_file.read()
            gcs_file.close()
            return fileavability, file_data
        except Exception,e:
            fileavability = 0
            return fileavability, []

    def delete_files(self):
        pass
#        logging.info('Deleting files...\n')
#        for filename in self.tmp_filenames_to_clean_up:
#            logging.info('Deleting file %s\n' % filename)
#            try:
#                gcs.delete(filename)
#            except gcs.NotFoundError:
#                pass

    def delete_files(self, filename):
        logging.info('Deleting file %s\n' % filename)
        try:
            gcs.delete(filename)
        except gcs.NotFoundError:
            pass
