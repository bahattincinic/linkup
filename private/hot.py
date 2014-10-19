from math import log
from datetime import datetime, timedelta
import time

epoch = datetime(1970, 1, 1)
now = datetime.now()

def since_epoch(days):
    """ Returns the number of seconds from the epoch to date. """
    ee = int(time.time())
    return ee - int(timedelta(days=days).total_seconds())

def hot(score, days):
    s = score
    order = log(max(abs(score), 1), 10)
    print order
    sign = 1 if s > 0 else -1 if s < 0 else 0
    print sign
    seconds = since_epoch(days)
    print seconds
    return round(order + sign * seconds / 45000, 7)

print since_epoch(10)