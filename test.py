import unittest
from datetime import datetime, timedelta
import download


class TestDownloadMethods(unittest.TestCase):

    def test_get_months_1(self):
        expected = []
        today = datetime.today()
        expected.append(today.strftime('%Y-%m'))
        self.assertEqual(download.get_months(1), expected)

    def test_get_months_3(self):
        expected = []
        today = datetime.today()
        expected.append(today.strftime('%Y-%m'))
        last_month = today - timedelta(days=today.day)
        expected.append(last_month.strftime('%Y-%m'))
        month_before_last = last_month - timedelta(days=last_month.day)
        expected.append(month_before_last.strftime('%Y-%m'))
        self.assertEqual(download.get_months(3), expected)


if __name__ == '__main__':
    unittest.main()
