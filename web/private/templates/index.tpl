<?php include('header.tpl'); ?>
<ul>
<?php foreach($result as $dir => $value): ?>
	<li><h1><?php echo $dir; ?></h1>
	<ul>
	<?php foreach($value as $v): ?>
		<li>
			<h2><a href="<?php echo $v['link']; ?>"><?php echo $v['word']; ?></a></h2>
		</li>
	<?php endforeach; ?>
	</ul>
	</li>
<?php endforeach; ?>
<?php include('footer.tpl'); ?>
